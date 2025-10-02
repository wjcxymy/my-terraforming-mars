/**
 * @name         Terraforming Mars 增强助手模块
 * @description  为 Terraforming Mars 网页版玩家页面提供UI增强和流程自动化，包含快捷侧边栏、卡面按钮、智能滚动等功能。
 * @version      7.0 (稳定版)
 * @author       由 Gemini 根据用户需求迭代生成
 *
 * @feature      主要功能列表:
 *
 * 1.  **UI增强 - 快捷操作侧边栏**:
 *     - 在游戏原生侧边栏旁动态附加一个独立的快捷操作栏。
 *     - 提供“地图”、“森林”、“升温”、“执行”、“打出”、“标准”、“贩卖”等核心操作的快捷按钮。
 *     - 按钮的可用状态会根据当前游戏中实际可执行的行动动态更新。
 *
 * 2.  **流程自动化 - 简化操作，减少点击**:
 *     - **一键选择与双击确认**: 快速选择或完成行动。
 *     - **智能视图管理**: 自动在地图和行动区之间跳转视图，并在需要时（如等待资源选择）自动滚动到行动区，同时优先响应“前往地图”指令。
 *     - **操作惯性**: 完成一个动作后，如果同类型的动作依然可选，脚本会尝试自动重新选中。
 *
 * 3.  **卡牌操作界面全面优化**:
 *     - **统一的卡面快捷按钮**:
 *         - 为“**打出卡牌**”、“**执行行动**”和“**贩卖专利**”这三个需要选择卡牌的操作界面，都在卡牌图示的正中央生成一个醒目、易于点击的快捷按钮（如“打出”、“执行”、“贩卖”）。
 *         - **(增强)** 智能处理多选情况：在贩卖专利时，按钮只会出现在最后一张被选中的卡牌上。
 *     - **支付面板重定位与美化**: 在“打出卡牌”时，支付面板会自动附着在卡面按钮下方，并进行美化。
 *
 * 4.  **兼容性与稳定性**:
 *     - **多语言精确匹配**: 严格根据提供的中、英文行动文本进行精确匹配。
 *     - **动态DOM监视**: 通过 `MutationObserver` 实时监控游戏界面的变化，确保助手稳定运行。
 */

interface ButtonConfig {
    key: string;
    text: string;
    color: string;
    type: 'map' | 'action';
    candidates: string[];
}

// 按钮配置数组，定义了侧边栏所有按钮的属性和匹配规则
const BUTTON_CONFIG: ButtonConfig[] = [
  {key: 'go_to_map_top', text: '地图', color: 'blue', type: 'map', candidates: []},
  {key: 'forest', text: '森林', color: 'lightgreen', type: 'action', candidates: ['Convert 8 plants into greenery', '将8植物转换为森林']},
  {key: 'raise_temperature', text: '升温', color: 'lightred', type: 'action', candidates: ['Convert 7 heat into temperature', '将7热能转换为温度']},
  {key: 'card_action', text: '执行', color: 'blue', type: 'action', candidates: ['Perform an action from a played card', '执行一个已打出卡牌的行动']},
  {key: 'play_project', text: '打出', color: 'green', type: 'action', candidates: ['Play project card', '打出项目卡']},
  {key: 'standard_project', text: '标准', color: 'yellow', type: 'action', candidates: ['Standard projects', '标准项目']},
  {key: 'skip_generation', text: '跳过', color: 'red', type: 'action', candidates: ['Pass for this generation', '跳过本时代']},
  {key: 'sell_patents', text: '贩卖', color: 'orange', type: 'action', candidates: ['Sell patents', '贩卖专利']},
  {key: 'undo_action', text: '撤回', color: 'purple', type: 'action', candidates: ['Undo last action', '撤回操作']},
];

export class TMEnhancement {
  // 用于实现“操作惯性”功能，记录上一次执行的动作类型
  private lastActionKey: string | null = null;
  // 对支付面板的引用，用于在非卡牌操作时进行位置重置
  private fixedPaymentPanel: HTMLElement | null = null;
  // DOM变动观察器，是整个模块动态响应页面变化的核心
  private observer: MutationObserver | null = null;
  // 助手侧边栏的DOM引用
  private helperSidebar: HTMLElement | null = null;
  // 尺寸变动观察器，用于跟踪原生侧边栏的位置和大小变化
  private resizeObserver: ResizeObserver | null = null;
  // 用于防抖的计时器ID
  private updateTimeout: number | null = null;
  // 状态锁，用于确保“智能滚动”在一次“全按钮失效”期间只触发一次
  private hasScrolledOnInactive: boolean = false;

  // 绑定事件处理器，确保 'this' 上下文正确
  private handleToolbarClick = (e: Event) => this.onToolbarClick(e);
  private handleToolbarDoubleClick = (e: Event) => this.onToolbarDoubleClick(e);
  private handleGlobalConfirmClick = (e: Event) => this.onGlobalConfirmClick(e);
  private handleRadioChange = (e: Event) => this.onRadioChange(e);
  private runAllUpdates = () => this.debouncedUpdateCycle();

  /**
   * 启动模块，初始化所有功能。
   */
  public start(): void {
    console.log('[TM-HELPER] 增强助手模块初始化...');
    this.ensureStyle();
    this.createHelperSidebar();
    this.setupGlobalListeners();
    this.observeAndMaintain();
  }

  /**
   * 当页面发生路由切换等大规模DOM变化时，重新附加UI和监听器。
   */
  public reattach(): void {
    console.log('[TM-HELPER] 重新绑定到DOM...');
    this.waitForElement('.sidebar_cont.sidebar').then((nativeSidebar) => {
      if (nativeSidebar instanceof HTMLElement) {
        this.startTrackingSidebar(nativeSidebar);
      } else {
        console.error('[TM-HELPER] reattach失败: 未找到原生侧边栏。');
        if (this.helperSidebar) this.helperSidebar.style.display = 'none';
      }
    });
  }

  /**
   * 销毁模块，清理所有DOM元素和事件监听器，用于组件卸载。
   */
  public destroy(): void {
    this.observer?.disconnect();
    this.resizeObserver?.disconnect();
    this.helperSidebar?.remove();
    this.helperSidebar = null;
    document.documentElement.style.removeProperty('--tm-helper-total-sidebar-width');
    document.getElementById('tm-helper-style')?.remove();
    document.body.removeEventListener('click', this.handleGlobalConfirmClick, true);
    document.body.removeEventListener('change', this.handleRadioChange);
    console.log('[TM-HELPER] 增强助手模块已销毁。');
  }

  /**
   * 等待指定选择器的元素出现在DOM中。
   * @param selector CSS选择器
   * @param timeout 超时时间（毫秒）
   * @returns Promise，解析为找到的元素或null
   */
  private waitForElement(selector: string, timeout = 5000): Promise<Element | null> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const tryFind = () => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
        } else if (Date.now() - startTime > timeout) {
          resolve(null);
        } else {
          requestAnimationFrame(tryFind);
        }
      };
      tryFind();
    });
  }

  /**
   * 创建并注入快捷操作侧边栏。
   */
  private createHelperSidebar(): void {
    if (this.helperSidebar) return;

    this.helperSidebar = document.createElement('div');
    this.helperSidebar.className = 'tm-helper-sidebar';

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'tm-helper-button-container';
    this.helperSidebar.appendChild(buttonContainer);

    BUTTON_CONFIG.forEach((btn) => {
      const itemContainer = document.createElement('div');
      itemContainer.className = 'sidebar_item tm-helper-item';
      const mainBtn = document.createElement('button');
      mainBtn.type = 'button';
      mainBtn.className = 'tm-btn';
      mainBtn.dataset.key = btn.key;
      mainBtn.textContent = btn.text;
      mainBtn.addEventListener('click', this.handleToolbarClick);
      mainBtn.addEventListener('dblclick', this.handleToolbarDoubleClick);
      itemContainer.appendChild(mainBtn);
      buttonContainer.appendChild(itemContainer);
    });

    document.body.appendChild(this.helperSidebar);
  }

  /**
   * 启动对原生侧边栏的尺寸和位置的跟踪，以动态调整助手侧边栏的位置。
   * @param nativeSidebar 游戏的原生侧边栏元素
   */
  private startTrackingSidebar(nativeSidebar: HTMLElement): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if (this.helperSidebar) {
      this.helperSidebar.style.display = 'flex';
    }

    const updatePositionAndLayout = () => {
      if (!this.helperSidebar || !nativeSidebar) return;
      const originalRect = nativeSidebar.getBoundingClientRect();

      this.helperSidebar.style.top = `${originalRect.top}px`;
      this.helperSidebar.style.height = `${originalRect.height}px`;
      this.helperSidebar.style.left = `${originalRect.right}px`;

      const totalSidebarWidth = this.helperSidebar.offsetWidth;
      document.documentElement.style.setProperty('--tm-helper-total-sidebar-width', `${totalSidebarWidth}px`);
    };

    this.resizeObserver = new ResizeObserver(updatePositionAndLayout);
    this.resizeObserver.observe(nativeSidebar);
    if (this.helperSidebar) {
      this.resizeObserver.observe(this.helperSidebar);
    }

    updatePositionAndLayout();
  }

  /**
   * 规范化文本，移除所有空白字符。
   */
  private normalizeText = (s: string | null | undefined): string => String(s || '').replace(/\s+/g, '').trim();

  /**
   * 滚动到地图视图。
   */
  private scrollToMap = (): void => (document.querySelector('a[href*="#board"]') as HTMLElement)?.click();

  /**
   * 滚动到行动区视图。
   */
  private scrollToActions = (): void => {
    (document.querySelector('a[href="#actions"]') as HTMLElement)?.click();
  };

  /**
   * 点击游戏主确认按钮。
   */
  private clickMainConfirmButton = (): void => {
    this.storeLastActionFromUI();
    (document.querySelector('.wf-action .btn-submit') as HTMLElement)?.click();
  };

  /**
   * 在点击确认按钮前，存储当前选中的行动类型，用于实现“操作惯性”。
   */
  private storeLastActionFromUI(): void {
    const checkedRadio = document.querySelector<HTMLInputElement>('.form-radio input[type="radio"]:checked');
    if (!checkedRadio) {
      this.lastActionKey = null; return;
    }
    const label = checkedRadio.closest('.form-radio');
    const text = this.normalizeText(label?.textContent);
    if (!text) {
      this.lastActionKey = null; return;
    }
    const config = BUTTON_CONFIG.find((cfg) =>
      cfg.type === 'action' && cfg.candidates.map(this.normalizeText).some((candidate) => text.includes(candidate)),
    );
    this.lastActionKey = config ? config.key : null;
  }

  /**
   * 根据候选项文本数组，查找对应的行动选项label元素。
   * @param candidates 候选项文本数组
   * @returns 找到的HTMLLabelElement或null
   */
  private findRadioLabelByText(candidates: string[]): HTMLLabelElement | null {
    const labels = Array.from(document.querySelectorAll<HTMLLabelElement>('label.form-radio'));
    if (!labels.length) return null;
    const normalizedCandidates = candidates.map(this.normalizeText);
    for (const label of labels) {
      const text = this.normalizeText(label.textContent);
      if (normalizedCandidates.some((c) => text.includes(c))) return label;
    }
    return null;
  }

  /**
   * 确保模块所需的CSS样式已注入到页面中。
   */
  private ensureStyle(): void {
    if (document.getElementById('tm-helper-style')) return;
    const style = document.createElement('style');
    style.id = 'tm-helper-style';
    style.textContent = `
            :root { --tm-helper-total-sidebar-width: 0px; }
            #player-home {
                margin-left: var(--tm-helper-total-sidebar-width, 0px) !important;
                transition: margin-left 0.2s ease-out;
            }
            .tm-helper-sidebar {
                position: fixed; display: flex; flex-direction: column;
                justify-content: center;
                background: transparent;
                border: none;
                pointer-events: none;
                padding: 4px; z-index: 1000;
                transition: left 0.1s ease-out, top 0.1s ease-out;
            }
            .tm-helper-button-container {
                display: flex; flex-direction: column; gap: 4px;
                pointer-events: auto;
            }
            .sidebar_item.tm-helper-item { display: flex; padding: 2px; }
            .sidebar_item.tm-helper-item .tm-btn { flex-grow: 1; font-size: 12px; line-height: 1.4; padding: 6px 4px; border-radius: 4px; border: 1px solid rgba(0,0,0,.2); color: #fff; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,.1); text-align: center; transition: all 0.2s; }
            .sidebar_item.tm-helper-item .tm-btn:hover { filter: brightness(0.96); }
            .tm-btn--disabled { background-color:#9ca3af !important; color:#fff !important; cursor:not-allowed; pointer-events:none; opacity:0.8; }
            .tm-btn--blue{background-color:#3b82f6;} .tm-btn--green{background-color:#10b981;} .tm-btn--yellow{background-color:#f59e0b;color:#111;} .tm-btn--red{background-color:#ef4444;} .tm-btn--orange{background-color:#fb923c;color:#111;} .tm-btn--purple{background-color:#8b5cf6;} .tm-btn--lightred{background-color:#f87171;} .tm-btn--lightgreen{background-color:#86efac;color:#065f46;}
            .tm-card-action-btn { position: absolute; top: 30%; left: 50%; transform: translate(-50%, -50%); z-index: 10; font-size: 18px; font-weight: bold; padding: 10px 18px; border-radius: 25px; border: 1px solid rgba(255,255,255,.5); color: #fff; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,.4); transition: all 0.2s ease-out; }
            .tm-card-action-btn:hover { transform: translate(-50%, -50%) scale(1.05); box-shadow: 0 6px 20px rgba(0,0,0,.4); }
            .tm-card-action-btn--play { background-color: rgba(16, 185, 129, 0.9); }
            .tm-card-action-btn--play:hover { background-color: rgba(5, 150, 105, 0.95); }
            .tm-card-action-btn--action { background-color: rgba(59, 130, 246, 0.9); }
            .tm-card-action-btn--action:hover { background-color: rgba(37, 99, 235, 0.95); }
            .tm-card-action-btn--sell { background-color: rgba(249, 115, 22, 0.9); }
            .tm-card-action-btn--sell:hover { background-color: rgba(234, 88, 12, 0.95); }
            .tm-card-container-relative{ position:relative !important; }
            .tm-payment-panel--moved {
                position: absolute !important;
                left: 50%;
                top: calc(30% + 28px);
                width: calc(100% - 16px);
                transform: translateX(-50%) scale(0.7);
                transform-origin: top;
                z-index: 20; background: rgba(0, 0, 0, 0.75) !important;
                backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                border-radius: 8px !important; box-shadow: 0 4px 12px rgba(0,0,0,.3) !important;
                margin: 0 !important; padding: 8px !important;
            }
            .tm-payment-panel--moved .payment_amount input[type="text"],
            .tm-payment-panel--moved .payment_amount input[type="number"] {
                font-size: 12px !important;
            }
            .tm-payment-panel--moved h3.payments_title { display: none; }
        `;
    document.head.appendChild(style);
  }

  /**
   * 更新侧边栏按钮的可用状态（激活/禁用）。
   */
  private updateToolbar(): void {
    BUTTON_CONFIG.forEach((cfg) => {
      const mainBtn = this.helperSidebar?.querySelector<HTMLButtonElement>(`.tm-btn[data-key="${cfg.key}"]`);
      if (!mainBtn) return;
      // '地图'按钮始终可用，其他按钮的可用性取决于是否能找到对应的行动选项
      const isAvailable = cfg.type === 'map' || !!this.findRadioLabelByText(cfg.candidates);
      const colors = ['blue', 'green', 'yellow', 'red', 'orange', 'purple', 'lightred', 'lightgreen'];
      mainBtn.classList.remove(...colors.map((c) => `tm-btn--${c}`));
      mainBtn.classList.add(`tm-btn--${cfg.color}`);
      mainBtn.classList.toggle('tm-btn--disabled', !isAvailable);
    });
  }

  /**
   * 更新“如何支付”面板的位置，使其附着在卡面上或移回非卡牌操作的默认位置。
   */
  private updateFixedPanels(): void {
    const paymentTitle = Array.from(document.querySelectorAll('h3.payments_title')).find((el) => el.textContent?.includes('如何支付'));
    const currentPaymentPanel = paymentTitle ? paymentTitle.closest('section') : null;
    if (currentPaymentPanel) {
      const selectedCardLabel = document.querySelector('label.payments_cards input[type="radio"]:checked')?.closest('label.payments_cards');
      const cardContainer = selectedCardLabel?.querySelector('.card-container');
      if (cardContainer) {
        // 如果是在“打出卡牌”界面，将支付面板移动到卡牌下方
        cardContainer.classList.add('tm-card-container-relative');
        if (!cardContainer.contains(currentPaymentPanel)) {
          cardContainer.appendChild(currentPaymentPanel);
        }
        currentPaymentPanel.classList.add('tm-payment-panel--moved');
        if (this.fixedPaymentPanel === currentPaymentPanel) this.fixedPaymentPanel = null;
      } else {
        // 否则，将其移出卡牌（用于非卡牌操作，如标准项目）
        currentPaymentPanel.classList.remove('tm-payment-panel--moved');
        this.fixedPaymentPanel = currentPaymentPanel as HTMLElement;
      }
    } else if (this.fixedPaymentPanel) {
      this.fixedPaymentPanel = null;
    }

    // 为非卡牌操作的支付面板设置一个固定的、方便操作的位置
    if (this.fixedPaymentPanel) {
      const totalSidebarWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tm-helper-total-sidebar-width')) || 0;
      const finalLeft = totalSidebarWidth + 8;
      let nextTopPosition = 0;

      const playBtn = this.helperSidebar?.querySelector<HTMLElement>('.tm-btn[data-key="play_project"]');
      if (playBtn) {
        const playRect = playBtn.getBoundingClientRect();
        nextTopPosition = playRect.top + playRect.height / 2;
      } else {
        nextTopPosition = window.innerHeight / 2;
      }

      this.fixedPaymentPanel.style.left = `${finalLeft}px`;
      const panelRect = this.fixedPaymentPanel.getBoundingClientRect();
      const top = nextTopPosition - (panelRect.height / 2);
      this.fixedPaymentPanel.style.top = `${Math.max(10, top)}px`;
    }
  }

  /**
   * 应用“操作惯性”逻辑：如果上一个动作在本轮更新后依然可用，则自动选中它。
   */
  private applyActionInertia(): void {
    if (!this.lastActionKey) return;
    const config = BUTTON_CONFIG.find((b) => b.key === this.lastActionKey);
    if (!config) {
      this.lastActionKey = null; return;
    }
    const label = this.findRadioLabelByText(config.candidates);
    if (label) {
      const radio = label.querySelector<HTMLInputElement>('input[type="radio"]');
      // 只有在选项存在且未被选中的情况下才自动点击
      if (radio && !radio.checked) {
        radio.click();
        if (config.key === 'forest') setTimeout(this.scrollToMap, 100);
      }
    }
    this.lastActionKey = null; // 无论是否成功，惯性只应用一次
  }

  /**
   * 管理单个卡牌上的快捷按钮的添加或移除。
   * @param label 卡牌的label元素
   * @param shouldHaveButton 此卡是否应该有按钮
   * @param buttonText 按钮文本
   * @param buttonType 按钮类型（用于设置样式）
   */
  private manageCardButton(label: HTMLLabelElement, shouldHaveButton: boolean, buttonText: string, buttonType: 'play' | 'action' | 'sell'): void {
    const container = label.querySelector<HTMLElement>('.card-container');
    if (!container) return;

    const existingBtn = container.querySelector<HTMLButtonElement>('.tm-card-action-btn');

    if (shouldHaveButton) {
      // 如果应该有按钮但现在没有，则创建并添加
      if (!existingBtn) {
        container.classList.add('tm-card-container-relative');
        const actionBtn = document.createElement('button');
        actionBtn.type = 'button';
        actionBtn.className = `tm-card-action-btn tm-card-action-btn--${buttonType}`;
        actionBtn.textContent = buttonText;
        actionBtn.onclick = (e) => {
          e.stopPropagation();
          e.preventDefault();
          this.clickMainConfirmButton();
        };
        container.appendChild(actionBtn);
      }
    } else {
      // 如果不应该有按钮但现在有，则移除
      if (existingBtn) {
        existingBtn.remove();
      }
    }
  }

  /**
   * 统一更新所有卡牌操作界面的快捷按钮。
   * 这是一个核心的“幂等”方法，它会智能判断哪个卡牌应该显示按钮，并只在必要时操作DOM。
   */
  private updateAllCardButtons(): void {
    let activeCardLabel: HTMLLabelElement | null = null;
    let buttonText = '';
    let buttonType: 'play' | 'action' | 'sell' = 'play';

    // 检查“打出项目”是否被选中
    const playConfig = BUTTON_CONFIG.find((c) => c.key === 'play_project');
    if (playConfig) {
      const playMainLabel = this.findRadioLabelByText(playConfig.candidates);
      if (playMainLabel?.querySelector('input:checked')) {
        activeCardLabel = document.querySelector('label.payments_cards input[type="radio"]:checked')?.closest('label.payments_cards') as HTMLLabelElement;
        buttonText = '打出';
        buttonType = 'play';
      }
    }

    // 检查“执行行动”是否被选中
    const actionConfig = BUTTON_CONFIG.find((c) => c.key === 'card_action');
    if (actionConfig) {
      const actionMainLabel = this.findRadioLabelByText(actionConfig.candidates);
      if (actionMainLabel?.querySelector('input:checked')) {
        const cardContainer = actionMainLabel.nextElementSibling;
        activeCardLabel = cardContainer?.querySelector('label.cardbox input[type="radio"]:checked')?.closest('label.cardbox') as HTMLLabelElement;
        buttonText = '执行';
        buttonType = 'action';
      }
    }

    // 检查“贩卖专利”是否被选中（特殊处理多选情况）
    const sellConfig = BUTTON_CONFIG.find((c) => c.key === 'sell_patents');
    if (sellConfig) {
      const sellMainLabel = this.findRadioLabelByText(sellConfig.candidates);
      if (sellMainLabel?.querySelector('input:checked')) {
        const cardContainer = sellMainLabel.nextElementSibling;
        const checkedInputs = Array.from(cardContainer?.querySelectorAll<HTMLInputElement>('label.cardbox input[type="checkbox"]:checked') ?? []);
        if (checkedInputs.length > 0) {
          // 按钮只出现在最后一张被选中的卡牌上
          activeCardLabel = checkedInputs[checkedInputs.length - 1].closest('label.cardbox');
          buttonText = '贩卖';
          buttonType = 'sell';
        }
      }
    }

    // 遍历所有可能的卡牌label，根据上面的判断结果来决定是否显示按钮
    const allLabels = document.querySelectorAll('label.payments_cards, label.cardbox');
    allLabels.forEach((label) => {
      const shouldHave = label === activeCardLabel;
      this.manageCardButton(label as HTMLLabelElement, shouldHave, buttonText, buttonType);
    });
  }

  /**
   * 自动点击“前往地图”的提示。
   */
  private autoGoToMap(): void {
    const goToMapContainer = document.querySelector<HTMLElement>('.gotomap_cont');
    if (goToMapContainer) {
      const clickableSpan = goToMapContainer.querySelector<HTMLElement>('span[v-i18n], span');
      if (clickableSpan) {
        console.log('[TM-HELPER] 检测到 "Go to map"，自动点击...');
        clickableSpan.click();
      }
    }
  }

  /**
   * 处理“智能状态感知滚动”逻辑。
   * 当所有行动按钮都不可用，且没有“前往地图”提示时，自动滚动到行动区一次。
   */
  private handleAutoScrollOnInactive(): void {
    // 优先级1: 如果游戏要求玩家去地图，则不执行任何操作并重置状态锁
    const goToMapContainer = document.querySelector<HTMLElement>('.gotomap_cont');
    if (goToMapContainer) {
      this.hasScrolledOnInactive = false;
      return;
    }

    // 优先级2: 检查是否有任何一个“行动”按钮是可用的
    const isAnyActionAvailable = BUTTON_CONFIG.some((cfg) => {
      if (cfg.type !== 'action') return false; // 排除“地图”按钮
      return !!this.findRadioLabelByText(cfg.candidates);
    });

    if (isAnyActionAvailable) {
      // 如果有任何一个行动按钮可用，说明玩家处于正常操作状态，重置状态锁
      this.hasScrolledOnInactive = false;
      return;
    }

    // 只有在以上条件都不满足，且锁是“开”的情况下，才执行滚动
    if (!this.hasScrolledOnInactive) {
      console.log('[TM-HELPER] 所有行动按钮均不可用，自动滚动到行动区...');
      this.scrollToActions();
      this.hasScrolledOnInactive = true; // 将锁设为“关”，防止重复滚动
    }
  }

  /**
   * 处理侧边栏按钮的单击事件。
   */
  private onToolbarClick(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    const key = target.dataset.key;
    const config = BUTTON_CONFIG.find((b) => b.key === key);
    if (!config) return;

    if (config.type === 'map') {
      this.scrollToMap();
      return;
    }

    if (config.type === 'action') {
      const label = this.findRadioLabelByText(config.candidates);
      if (label) {
        (label.querySelector('input[type="radio"]') as HTMLElement)?.click();

        if (config.key === 'forest') {
          setTimeout(this.scrollToMap, 100);
        } else {
          requestAnimationFrame(() => this.scrollToActions());
        }
      } else {
        console.warn(`[TM-HELPER] 未找到选项: ${config.text}`);
      }
    }
  }

  /**
   * 处理侧边栏按钮的双击事件，实现“选择并确认”。
   */
  private onToolbarDoubleClick(event: Event): void {
    event.preventDefault();
    (event.currentTarget as HTMLElement).click();
    requestAnimationFrame(() => this.clickMainConfirmButton());
  }

  /**
   * 全局点击事件监听器，主要用于在点击主确认按钮时存储最后动作。
   */
  private onGlobalConfirmClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.closest('.wf-action .btn-submit')) {
      this.storeLastActionFromUI();
    }
  }

  /**
   * 全局 change 事件监听器，主要用于在选择卡牌时触发界面更新。
   */
  private onRadioChange(_event: Event): void {
    // 使用 requestAnimationFrame 确保在DOM更新后执行，避免布局抖动
    requestAnimationFrame(() => {
      this.updateAllCardButtons();
      this.updateFixedPanels();
    });
  }

  /**
   * 设置全局事件监听器。
   */
  private setupGlobalListeners(): void {
    document.body.addEventListener('click', this.handleGlobalConfirmClick, true);
    document.body.addEventListener('change', this.handleRadioChange);
  }

  /**
   * 主更新循环，调用所有需要根据界面变化而更新的方法。
   */
  private updateCycle(): void {
    if (!this.helperSidebar) return;
    this.updateToolbar();
    this.updateAllCardButtons();
    this.updateFixedPanels();
    this.applyActionInertia();
    this.autoGoToMap();
    this.handleAutoScrollOnInactive();
  }

  /**
   * 使用防抖技术来优化更新循环的执行频率。
   */
  private debouncedUpdateCycle(): void {
    if (this.updateTimeout) clearTimeout(this.updateTimeout);
    this.updateTimeout = window.setTimeout(() => {
      this.updateCycle();
    }, 50);
  }

  /**
   * 设置MutationObserver来监视整个文档的DOM变化，并触发更新循环。
   */
  private observeAndMaintain(): void {
    this.observer = new MutationObserver(this.runAllUpdates);
    this.observer.observe(document.documentElement, {childList: true, subtree: true});
  }
}
