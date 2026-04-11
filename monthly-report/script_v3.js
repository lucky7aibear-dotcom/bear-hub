const API_KEY = 'AIzaSyA82R71I7MF7yjb0sltr49lzBWP-_QXS60';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize default inputs
    addCategory();
    addMetric();
    addPlan();
    
    // Set default month
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    document.getElementById('input-month').value = `${year}年${month}月`;

    // Event Listeners
    document.getElementById('add-category-btn').addEventListener('click', addCategory);
    document.getElementById('add-metric-btn').addEventListener('click', addMetric);
    document.getElementById('add-plan-btn').addEventListener('click', addPlan);
    document.getElementById('generate-btn').addEventListener('click', generatePreview);
    document.getElementById('copy-btn').addEventListener('click', copyToClipboard);
    
    document.getElementById('ai-expand-fun-btn').addEventListener('click', (e) => {
        const input = document.getElementById('input-fun');
        handleAIExpand(input, 'fun', e.target);
    });
    document.getElementById('ai-translate-fun-btn').addEventListener('click', (e) => {
        const input = document.getElementById('input-fun');
        handleAIExpand(input, 'translate', e.target);
    });
});

// --- Dynamic UI Functions ---

function addCategory() {
    const container = document.getElementById('categories-container');
    const categoryId = 'cat-' + Date.now();
    
    const block = document.createElement('div');
    block.className = 'category-block';
    block.id = categoryId;
    block.innerHTML = `
        <div class="category-header">
            <input type="text" class="category-name" placeholder="Category Name (e.g., Product Development)">
            <button type="button" class="btn-remove" onclick="removeElement('${categoryId}')">✕</button>
        </div>
        <div class="tasks-container" id="tasks-${categoryId}"></div>
        <button type="button" class="btn-text" onclick="addTask('${categoryId}')">+ Add Task</button>
    `;
    
    container.appendChild(block);
    addTask(categoryId); // Add one default task
}

function addTask(categoryId) {
    const container = document.getElementById(`tasks-${categoryId}`);
    const taskId = 'task-' + Date.now() + Math.random().toString(36).substr(2, 9);
    
    const item = document.createElement('div');
    item.className = 'dynamic-item';
    item.id = taskId;
    item.innerHTML = `
        <input type="text" class="task-input" placeholder="Enter accomplished task...">
        <button type="button" class="btn-text btn-sm" style="color: var(--secondary);" onclick="handleTaskAI('${taskId}', event)">✨ AI</button>
        <button type="button" class="btn-text btn-sm" style="color: var(--primary); margin-left: 5px;" onclick="handleTaskTranslate('${taskId}', event)">🌐 EN</button>
        <button type="button" class="btn-remove" onclick="removeElement('${taskId}')">✕</button>
    `;
    
    container.appendChild(item);
}

function addMetric() {
    const container = document.getElementById('metrics-container');
    const metricId = 'metric-' + Date.now();
    
    const item = document.createElement('div');
    item.className = 'dynamic-item';
    item.id = metricId;
    item.innerHTML = `
        <input type="text" class="metric-label" placeholder="Metric Name (e.g., Churn Rate)" style="flex: 2;">
        <input type="text" class="metric-value" placeholder="Value (e.g., 5%)" style="flex: 1;">
        <button type="button" class="btn-remove" onclick="removeElement('${metricId}')">✕</button>
    `;
    
    container.appendChild(item);
}

function addPlan() {
    const container = document.getElementById('plans-container');
    const planId = 'plan-' + Date.now();
    
    const item = document.createElement('div');
    item.className = 'dynamic-item';
    item.id = planId;
    item.innerHTML = `
        <input type="text" class="plan-input" placeholder="Enter next month's plan...">
        <button type="button" class="btn-remove" onclick="removeElement('${planId}')">✕</button>
    `;
    
    container.appendChild(item);
}

function removeElement(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

// --- Generation Logic ---

function generateNewsletterHTML() {
    const month = document.getElementById('input-month').value;
    const fun = document.getElementById('input-fun').value;
    
    // Get Categories and Tasks
    const categoryBlocks = document.querySelectorAll('.category-block');
    let tasksHtml = '';
    
    categoryBlocks.forEach(block => {
        const catName = block.querySelector('.category-name').value;
        const taskInputs = block.querySelectorAll('.task-input');
        const tasks = Array.from(taskInputs).map(i => i.value).filter(v => v.trim() !== '');
        
        if (catName || tasks.length > 0) {
            tasksHtml += `
                <div style="margin-bottom: 20px; background: #fffefe; padding: 15px; border-radius: 16px; border: 1px solid #ffe5ec; box-shadow: 0 4px 10px rgba(255, 75, 114, 0.03);">
                    <h3 style="color: #ff4b72; font-size: 16px; margin-bottom: 12px; display: flex; align-items: center;">
                        <span style="display: inline-block; width: 12px; height: 12px; background: #ffaa00; border-radius: 50%; margin-right: 8px;"></span>
                        ${catName || 'Uncategorized'}
                    </h3>
                    <ul style="list-style-type: none; padding-left: 5px;">
                        ${tasks.map(t => `
                            <li style="padding: 8px 0; border-bottom: 1px solid #fff0f3; display: flex; align-items: baseline;">
                                <span style="color: #ff4b72; margin-right: 10px;">✦</span>
                                <span style="color: #2d3748;">${t}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }
    });

    // Get Metrics
    const metricItems = document.querySelectorAll('#metrics-container .dynamic-item');
    let metricsHtml = '';
    const validMetrics = Array.from(metricItems).filter(item => {
        const label = item.querySelector('.metric-label').value;
        const val = item.querySelector('.metric-value').value;
        return label.trim() !== '' || val.trim() !== '';
    });

    if (validMetrics.length > 0) {
        metricsHtml = `
            <div style="margin-bottom: 25px;">
                <h2 style="font-size: 18px; color: #2d3748; border-bottom: 2px solid #ffeaef; padding-bottom: 8px; margin-bottom: 15px;">Key Metrics</h2>
                <div style="display: flex; flex-wrap: wrap; gap: 15px;">
                    ${validMetrics.map(item => {
                        const label = item.querySelector('.metric-label').value;
                        const val = item.querySelector('.metric-value').value;
                        return `
                            <div style="background: linear-gradient(135deg, #fff5f8 0%, #fffefe 100%); padding: 15px; border-radius: 20px 5px 20px 5px; border: 1px solid #ffe5ec; text-align: center; min-width: 120px; flex: 1; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
                                <div style="font-size: 24px; font-weight: 700; color: #ff4b72;">${val}</div>
                                <div style="font-size: 12px; color: #718096; margin-top: 5px;">${label}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // Get Plans
    const planInputs = document.querySelectorAll('.plan-input');
    const plans = Array.from(planInputs).map(i => i.value).filter(v => v.trim() !== '');
    let plansHtml = '';
    
    if (plans.length > 0) {
        plansHtml = `
            <div style="margin-bottom: 25px;">
                <h2 style="font-size: 18px; color: #2d3748; border-bottom: 2px solid #ffeaef; padding-bottom: 8px; margin-bottom: 15px;">Next Month's Plan</h2>
                <ul style="list-style-type: none; padding-left: 5px;">
                    ${plans.map(p => `
                        <li style="padding: 8px 0; border-bottom: 1px solid #fff0f3; display: flex; align-items: baseline;">
                            <span style="color: #ffaa00; margin-right: 10px;">➔</span>
                            <span style="color: #2d3748;">${p}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    // Fun Findings
    let funHtml = '';
    if (fun.trim() !== '') {
        funHtml = `
            <div style="margin-bottom: 25px;">
                <h2 style="font-size: 18px; color: #2d3748; border-bottom: 2px solid #ffeaef; padding-bottom: 8px; margin-bottom: 15px;">Fun Findings</h2>
                <div style="background: #fffaf0; padding: 15px; border-radius: 20px 20px 5px 20px; border: 1px solid #ffeacc; color: #dd6b20;">
                    ${fun.replace(/\n/g, '<br>')}
                </div>
            </div>
        `;
    }

    // Combine into full template
    return `
        <div style="font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 15px 35px rgba(255, 75, 114, 0.05); border-radius: 24px; overflow: hidden; border: 1px solid #fff0f3;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #ff4b72 0%, #ffaa00 100%); color: white; padding: 35px; text-align: center; position: relative;">
                <div style="position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                <img src="logo.png" alt="Logo" style="max-height: 60px; margin-bottom: 15px; position: relative; z-index: 1;">
                <h1 style="font-size: 26px; margin-bottom: 10px; color: white; font-weight: 700; position: relative; z-index: 1;">${month} Report</h1>
                <p style="opacity: 0.9; font-size: 14px; position: relative; z-index: 1;">Here we record our efforts and achievements this month.</p>
            </div>
            
            <!-- Body -->
            <div style="padding: 30px;">
                <!-- Metrics -->
                ${metricsHtml}
                
                <!-- Tasks -->
                <div style="margin-bottom: 25px;">
                    <h2 style="font-size: 18px; color: #2d3748; border-bottom: 2px solid #ffeaef; padding-bottom: 8px; margin-bottom: 15px;">Accomplished Tasks</h2>
                    ${tasksHtml}
                </div>
                
                <!-- Plans -->
                ${plansHtml}
                
                <!-- Fun -->
                ${funHtml}
                
                <!-- Footer -->
                <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #a0aec0; border-top: 1px solid #fff0f3; padding-top: 20px;">
                    Focus on excellence, continuous improvement.<br>
                    © 2026 Newsletter Generator
                </div>
            </div>
        </div>
    `;
}

function generatePreview() {
    const html = generateNewsletterHTML();
    const previewContent = document.getElementById('preview-content');
    previewContent.innerHTML = html;
}

async function copyToClipboard() {
    const htmlString = generateNewsletterHTML();
    const plainText = "請在支援富文字的編輯器中貼上。"; // Fallback plain text
    
    try {
        const blob = new Blob([htmlString], { type: 'text/html' });
        const textBlob = new Blob([plainText], { type: 'text/plain' });
        
        const data = [new ClipboardItem({
            'text/html': blob,
            'text/plain': textBlob
        })];
        
        await navigator.clipboard.write(data);
        
        // Visual feedback
        const copyBtn = document.getElementById('copy-btn');
        const originalText = copyBtn.innerText;
        copyBtn.innerText = "已複製！";
        copyBtn.style.backgroundColor = "#10b981";
        copyBtn.style.color = "white";
        
        setTimeout(() => {
            copyBtn.innerText = originalText;
            copyBtn.style.backgroundColor = "";
            copyBtn.style.color = "";
        }, 2000);
        
    } catch (err) {
        console.error('无法复制: ', err);
        alert('複製失敗，請手動全選預覽區域並複製。');
    }
}

// --- AI Functions ---

function handleTaskAI(taskId, event) {
    const item = document.getElementById(taskId);
    const input = item.querySelector('.task-input');
    handleAIExpand(input, 'task', event.target);
}

function handleTaskTranslate(taskId, event) {
    const item = document.getElementById(taskId);
    const input = item.querySelector('.task-input');
    handleAIExpand(input, 'translate', event.target);
}

async function handleAIExpand(inputElement, type, buttonElement) {
    const text = inputElement.value.trim();
    if (!text) {
        alert('請先輸入一些關鍵字！');
        return;
    }
    
    const originalText = buttonElement.innerText;
    buttonElement.innerText = "思考中...";
    buttonElement.classList.add('loading');
    
    try {
        let prompt = '';
        if (type === 'task') {
            prompt = `請將以下關於「完成任務」的簡短關鍵字，潤飾並擴充成一句專業、流暢且語氣正面的句子（繁體中文），適合放進月報中（不要加上標點符號或引號）："${text}"`;
        } else if (type === 'fun') {
            prompt = `請將以下關於「本月有趣發現」的內容，潤飾並擴充成一段生動、有趣且流暢的段落（繁體中文），適合放進月報中："${text}"`;
        } else if (type === 'translate') {
            prompt = `請將以下關於月報內容的簡短關鍵字或描述，先進行內容的優化與擴充（語氣專業、正面且流暢），並直接翻譯成適當的英文內容，適合放進英文商業月報中："${text}"`;
        }
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error('API Error Details:', data);
            throw new Error(`API 錯誤: ${response.status} - ${data.error?.message || '未知錯誤'}`);
        }
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const result = data.candidates[0].content.parts[0].text.trim();
            inputElement.value = result;
            generatePreview(); // Auto update preview
        } else {
            throw new Error('API 回傳格式不正確');
        }
        
    } catch (err) {
        console.error('AI 潤飾失敗: ', err);
        alert('AI 潤飾失敗，請檢查 API Key 是否正確或稍後再試。');
    } finally {
        buttonElement.innerText = originalText;
        buttonElement.classList.remove('loading');
    }
}
