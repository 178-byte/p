// 简单的JavaScript功能增强

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded事件触发 - 所有功能开始初始化');
    
    // 立即初始化首页编辑功能（简化版本）
    setupHomepageEditing();
    
    // 页面加载动画
    addLoadingAnimation();
    
    // 导航栏高亮当前页面
    highlightCurrentPage();
    
    // 表单验证增强
    enhanceForms();
    
    // 平滑滚动
    enableSmoothScroll();
    
    // 响应式导航菜单（移动端）
    setupMobileMenu();
    
    // 个人信息自动保存功能
    setupPersonalInfoAutoSave();
    
    // 作品集编辑功能
    if (window.location.pathname.includes('portfolio.html')) {
        console.log('作品集页面特定功能初始化');
        setupPortfolioEditing();
        setupExistingProjectsViewDetails();
    }
    
    // 设置全局可编辑文本功能
    setupGlobalEditableText();
});
});

// 首页编辑功能 - 点击直接编辑
function setupHomepageEditing() {
    console.log('首页编辑功能初始化');
    
    const heroTitle = document.getElementById('heroTitle');
    const heroDescription = document.getElementById('heroDescription');
    const imageUpload = document.getElementById('imageUpload');
    const profileImage = document.getElementById('profileImage');
    const placeholderImage = document.getElementById('placeholderImage');
    
    // 加载保存的数据
    loadSavedContent();
    
    // 设置可编辑文本
    if (heroTitle) setupEditableText(heroTitle);
    if (heroDescription) setupEditableText(heroDescription);
    
    // 图片上传功能
    if (placeholderImage) {
        placeholderImage.addEventListener('click', function() {
            if (imageUpload) {
                imageUpload.click();
            }
        });
        
        // 添加上传提示
        placeholderImage.title = '点击上传个人照片';
    }
    
    if (imageUpload) {
        imageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (profileImage) {
                        profileImage.src = e.target.result;
                        profileImage.style.display = 'block';
                    }
                    if (placeholderImage) {
                        placeholderImage.style.display = 'none';
                    }
                    
                    // 保存图片到localStorage
                    localStorage.setItem('profileImage', e.target.result);
                    
                    showNotification('照片上传成功！');
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// 显示自动保存通知
function showAutoSaveNotification() {
    const notification = document.getElementById('autoSaveNotification');
    if (notification) {
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
    }
}

// 通用可编辑文本功能 - 简化版本
function setupEditableText(element) {
    if (!element) {
        console.log('元素不存在，跳过设置');
        return;
    }
    
    console.log('为元素设置编辑功能:', element);
    
    let isEditing = false;
    let originalText = '';
    
    // 添加编辑提示样式
    element.style.cursor = 'pointer';
    element.title = '点击编辑';
    
    // 点击进入编辑模式
    element.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('点击了可编辑元素');
        
        if (!isEditing) {
            isEditing = true;
            originalText = element.textContent;
            element.contentEditable = true;
            element.style.border = '2px dashed #3498db';
            element.style.background = 'rgba(52, 152, 219, 0.1)';
            element.focus();
            
            // 选中全部文本
            try {
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(element);
                selection.removeAllRanges();
                selection.addRange(range);
            } catch (err) {
                console.log('文本选择失败:', err);
            }
        }
    });
    
    // 失去焦点时保存
    element.addEventListener('blur', function() {
        if (isEditing) {
            isEditing = false;
            element.contentEditable = false;
            element.style.border = 'none';
            element.style.background = 'transparent';
            
            // 如果内容有变化，保存
            if (element.textContent !== originalText) {
                console.log('内容已更新，正在保存...');
                saveContent();
                showAutoSaveNotification();
            }
        }
    });
    
    // Enter键保存编辑
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            element.blur();
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            element.textContent = originalText;
            element.blur();
        }
    });
}

// 全局可编辑文本功能
function setupGlobalEditableText() {
    console.log('开始设置全局可编辑文本功能');
    
    const editableElements = document.querySelectorAll('.editable-text');
    console.log(`找到 ${editableElements.length} 个可编辑元素`);
    
    editableElements.forEach((element, index) => {
        console.log(`设置第 ${index + 1} 个元素`);
        setupEditableText(element);
    });
}

// 作品集特定编辑功能
function setupPortfolioEditing() {
    console.log('作品集编辑功能初始化');
    
    // 加载保存的作品集数据
    loadPortfolioContent();
    
    // 设置图片上传功能
    const imagePlaceholders = document.querySelectorAll('.project-image-placeholder');
    imagePlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            const uploadInput = this.parentElement.querySelector('.image-upload-input');
            if (uploadInput) {
                uploadInput.click();
            }
        });
        
        placeholder.title = '点击上传项目图片';
    });
    
    // 设置图片上传
    const uploadInputs = document.querySelectorAll('.image-upload-input');
    uploadInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const placeholder = input.parentElement.querySelector('.project-image-placeholder');
                    if (placeholder) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.width = '100%';
                        img.style.height = '200px';
                        img.style.objectFit = 'cover';
                        img.style.borderRadius = '8px';
                        
                        placeholder.innerHTML = '';
                        placeholder.appendChild(img);
                        
                        savePortfolioContent();
                        showNotification('项目图片上传成功！');
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    });
    
    // 设置删除项目功能
    const deleteButtons = document.querySelectorAll('.btn-delete-project');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const projectItem = this.closest('.portfolio-item');
            if (projectItem && confirm('确定要删除这个项目吗？')) {
                projectItem.remove();
                savePortfolioContent();
                showNotification('项目已删除');
            }
        });
    });
    
    // 设置查看详情功能
    const viewButtons = document.querySelectorAll('.view-details');
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const modal = this.parentElement.querySelector('.project-details-modal');
            if (modal) {
                modal.style.display = 'block';
                // 延迟一点时间确保模态框完全显示后再设置编辑功能
                setTimeout(() => {
                    // 为模态框内的可编辑元素设置编辑功能
                    const modalEditables = modal.querySelectorAll('.editable-text');
                    console.log(`为模态框设置编辑功能，找到 ${modalEditables.length} 个可编辑元素`);
                    modalEditables.forEach(element => {
                        setupEditableText(element);
                    });
                    
                    // 确保模态框内容可以正确滚动和编辑
                    modal.style.overflow = 'auto';
                }, 100);
            }
        });
    });
    
    // 设置关闭模态框功能
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const modal = this.closest('.project-details-modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // 点击模态框外部关闭模态框
    const modals = document.querySelectorAll('.project-details-modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            // 如果点击的是模态框背景（不是内容区域），则关闭模态框
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// 添加新项目功能
function addNewProject() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    if (!portfolioGrid) return;
    
    const projectId = Date.now();
    const newProject = document.createElement('div');
    newProject.className = 'portfolio-item';
    newProject.dataset.projectId = projectId;
    newProject.style.position = 'relative';
    newProject.style.zIndex = '1';
    
    newProject.innerHTML = `
        <div class="portfolio-image">
            <span class="editable-text project-image-placeholder">点击上传项目图片</span>
            <div class="project-image-upload">
                <input type="file" accept="image/*" class="image-upload-input" style="display: none;">
            </div>
            <div class="project-actions" style="position: absolute; top: 10px; right: 10px;">
                <button class="btn-delete-project" style="background: rgba(231,76,60,0.8); color: white; border: none; padding: 5px; border-radius: 3px; cursor: pointer;">🗑️</button>
            </div>
        </div>
        <div class="portfolio-content">
            <h3 class="editable-text">新项目名称</h3>
            <p><strong>类别：</strong> <span class="editable-text">项目类别</span></p>
            <p><strong>技术栈：</strong> <span class="editable-text">使用技术</span></p>
            <p><strong>项目时长：</strong> <span class="editable-text">项目周期</span></p>
            <p><strong>成果：</strong> <span class="editable-text">项目成果</span></p>
            <div class="project-description" style="margin-top: 10px;">
                <strong>项目描述：</strong>
                <div class="editable-text project-desc" style="border: 1px dashed #ccc; padding: 10px; border-radius: 5px; margin-top: 5px; min-height: 80px;">请添加项目详细描述...</div>
            </div>
            <button class="btn btn-primary view-details" style="margin-top: 10px;">查看详情</button>
        </div>
    `;
    
    portfolioGrid.appendChild(newProject);
    
    // 为新项目的可编辑元素设置编辑功能
    const newEditables = newProject.querySelectorAll('.editable-text');
    newEditables.forEach(element => {
        setupEditableText(element);
    });
    
    // 设置新项目的其他功能
    setupNewProjectFunctions(newProject);
    
    savePortfolioContent();
    showNotification('新项目已添加，点击内容即可编辑');
}

// 设置新项目的功能
function setupNewProjectFunctions(projectElement) {
    // 图片上传
    const placeholder = projectElement.querySelector('.project-image-placeholder');
    const uploadInput = projectElement.querySelector('.image-upload-input');
    
    if (placeholder && uploadInput) {
        placeholder.addEventListener('click', function() {
            uploadInput.click();
        });
        
        placeholder.title = '点击上传项目图片';
        
        uploadInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.width = '100%';
                    img.style.height = '200px';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '8px';
                    
                    placeholder.innerHTML = '';
                    placeholder.appendChild(img);
                    
                    savePortfolioContent();
                    showNotification('项目图片上传成功！');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // 删除功能
    const deleteButton = projectElement.querySelector('.btn-delete-project');
    if (deleteButton) {
        deleteButton.addEventListener('click', function(e) {
            e.stopPropagation();
            if (confirm('确定要删除这个项目吗？')) {
                projectElement.remove();
                savePortfolioContent();
                showNotification('项目已删除');
            }
        });
    }
    
    // 查看详情功能（这里简化处理）
    const viewButton = projectElement.querySelector('.view-details');
    if (viewButton) {
        viewButton.addEventListener('click', function(e) {
            e.stopPropagation();
            showNotification('详情编辑功能已添加，点击内容即可编辑');
        });
    }
}

// 保存作品集内容
function savePortfolioContent() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    if (!portfolioGrid) return;
    
    const projects = [];
    const projectItems = portfolioGrid.querySelectorAll('.portfolio-item');
    
    projectItems.forEach(item => {
        const projectData = {
            id: item.dataset.projectId,
            title: item.querySelector('h3')?.textContent || '',
            category: item.querySelector('span.editable-text')?.textContent || '',
            tech: item.querySelectorAll('span.editable-text')[1]?.textContent || '',
            duration: item.querySelectorAll('span.editable-text')[2]?.textContent || '',
            result: item.querySelectorAll('span.editable-text')[3]?.textContent || '',
            description: item.querySelector('.project-desc')?.textContent || '',
            image: item.querySelector('.project-image-placeholder img')?.src || ''
        };
        projects.push(projectData);
    });
    
    localStorage.setItem('portfolioContent', JSON.stringify(projects));
}

// 加载作品集内容
function loadPortfolioContent() {
    const savedContent = localStorage.getItem('portfolioContent');
    if (!savedContent) return;
    
    try {
        const projects = JSON.parse(savedContent);
        const portfolioGrid = document.getElementById('portfolioGrid');
        if (!portfolioGrid) return;
        
        // 这里可以恢复保存的项目内容
        console.log('已加载保存的作品集内容', projects);
    } catch (e) {
        console.error('加载作品集内容失败', e);
    }
}

// 保存内容到localStorage
function saveContent() {
    const heroTitle = document.getElementById('heroTitle');
    const heroDescription = document.getElementById('heroDescription');
    
    const content = {
        title: heroTitle.textContent,
        description: heroDescription.textContent
    };
    
    localStorage.setItem('homepageContent', JSON.stringify(content));
}

// 加载保存的内容
function loadSavedContent() {
    const heroTitle = document.getElementById('heroTitle');
    const heroDescription = document.getElementById('heroDescription');
    const profileImage = document.getElementById('profileImage');
    const placeholderImage = document.getElementById('placeholderImage');
    
    // 加载文字内容
    const savedContent = localStorage.getItem('homepageContent');
    if (savedContent) {
        const content = JSON.parse(savedContent);
        heroTitle.textContent = content.title;
        heroDescription.textContent = content.description;
    }
    
    // 加载图片
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        profileImage.src = savedImage;
        profileImage.style.display = 'block';
        placeholderImage.style.display = 'none';
    }
}

// 显示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #27ae60;
        color: white;
        padding: 15px 30px;
        border-radius: 25px;
        box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
        z-index: 1002;
        font-size: 14px;
        animation: slideDown 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);
    
    console.log('所有功能初始化完成');
});

// 高亮当前页面导航链接
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === 'index.html' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// 表单增强功能
function enhanceForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // 实时表单验证
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
        
        // 表单提交处理
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showFormMessage('请检查表单中的错误', 'error');
            } else {
                // 在实际应用中，这里应该发送AJAX请求
                e.preventDefault();
                showFormMessage('消息发送成功！我们会尽快回复您。', 'success');
                this.reset();
            }
        });
    });
}

// 字段验证
function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    
    if (isRequired && !value) {
        showFieldError(field, '此字段为必填项');
        return false;
    }
    
    // 邮箱验证
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, '请输入有效的邮箱地址');
            return false;
        }
    }
    
    // 电话验证
    if (field.type === 'tel' && value) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, '请输入有效的手机号码');
            return false;
        }
    }
    
    return true;
}

// 显示字段错误
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#e74c3c';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.5rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// 清除字段错误
function clearFieldError(field) {
    field.style.borderColor = '';
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// 表单验证
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// 显示表单消息
function showFormMessage(message, type) {
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'form-message';
    messageDiv.style.padding = '1rem';
    messageDiv.style.margin = '1rem 0';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.textAlign = 'center';
    messageDiv.style.fontWeight = 'bold';
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
    } else {
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
    }
    
    messageDiv.textContent = message;
    
    const form = document.querySelector('form');
    form.insertBefore(messageDiv, form.firstChild);
    
    // 3秒后自动消失
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// 平滑滚动
function enableSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 移动端导航菜单
function setupMobileMenu() {
    const navbar = document.querySelector('.navbar');
    const navContainer = document.querySelector('.nav-container');
    
    // 创建移动端菜单按钮
    const menuButton = document.createElement('button');
    menuButton.innerHTML = '☰';
    menuButton.style.cssText = `
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #333;
    `;
    
    navContainer.appendChild(menuButton);
    
    // 响应式显示/隐藏菜单
    function toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.classList.toggle('mobile-active');
    }
    
    menuButton.addEventListener('click', toggleMobileMenu);
    
    // 媒体查询
    function handleResize() {
        const navMenu = document.querySelector('.nav-menu');
        if (window.innerWidth <= 768) {
            menuButton.style.display = 'block';
            navMenu.style.display = 'none';
            navMenu.classList.add('mobile-menu');
        } else {
            menuButton.style.display = 'none';
            navMenu.style.display = 'flex';
            navMenu.classList.remove('mobile-menu', 'mobile-active');
        }
    }
    
    // 添加移动端菜单样式
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .nav-menu.mobile-menu {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                flex-direction: column;
                padding: 1rem;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .nav-menu.mobile-active {
                display: flex !important;
            }
            
            .nav-menu.mobile-menu li {
                margin: 0.5rem 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 初始化和监听窗口大小变化
    handleResize();
    window.addEventListener('resize', handleResize);
}

// 个人信息自动保存功能
function setupPersonalInfoAutoSave() {
    // 只在关于我页面启用此功能
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'about.html') return;
    
    const infoTable = document.querySelector('.info-table');
    if (!infoTable) return;
    
    // 获取所有表单元素
    const inputs = infoTable.querySelectorAll('input, select, textarea');
    const saveButton = infoTable.parentNode.querySelector('.btn');
    
    // 为每个输入框添加保存功能
    inputs.forEach((input, index) => {
        // 实时保存（输入时自动保存）
        input.addEventListener('input', function() {
            autoSavePersonalInfo();
        });
        
        // 失去焦点时保存
        input.addEventListener('blur', function() {
            autoSavePersonalInfo();
        });
        
        // 选择框变化时保存
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', function() {
                autoSavePersonalInfo();
            });
        }
    });
    
    // 手动保存按钮
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            manualSavePersonalInfo();
        });
    }
    
    // 加载保存的信息
    loadSavedPersonalInfo();
    
    // 页面关闭前保存（保险机制）
    window.addEventListener('beforeunload', function() {
        autoSavePersonalInfo();
    });
    
    console.log('个人信息自动保存功能已启用');
}

// 自动保存个人信息
function autoSavePersonalInfo() {
    const infoTable = document.querySelector('.info-table');
    if (!infoTable) return;
    
    const inputs = infoTable.querySelectorAll('input, select, textarea');
    const personalInfo = {};
    
    inputs.forEach((input, index) => {
        const label = input.parentNode.previousElementSibling;
        const fieldName = label ? label.textContent.trim().replace('：', '').replace(' ', '_') : `field_${index}`;
        
        if (input.type === 'checkbox' || input.type === 'radio') {
            personalInfo[fieldName] = input.checked;
        } else {
            personalInfo[fieldName] = input.value;
        }
    });
    
    // 保存到localStorage
    localStorage.setItem('personalInfo', JSON.stringify(personalInfo));
    
    // 显示保存状态（短暂提示）
    showSaveStatus('已自动保存');
}

// 手动保存个人信息
function manualSavePersonalInfo() {
    autoSavePersonalInfo();
    showSaveStatus('信息已保存成功！', true);
}

// 加载保存的个人信息
function loadSavedPersonalInfo() {
    const savedInfo = localStorage.getItem('personalInfo');
    if (!savedInfo) return;
    
    const infoTable = document.querySelector('.info-table');
    if (!infoTable) return;
    
    const inputs = infoTable.querySelectorAll('input, select, textarea');
    const personalInfo = JSON.parse(savedInfo);
    
    inputs.forEach((input, index) => {
        const label = input.parentNode.previousElementSibling;
        const fieldName = label ? label.textContent.trim().replace('：', '').replace(' ', '_') : `field_${index}`;
        
        if (personalInfo.hasOwnProperty(fieldName)) {
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = personalInfo[fieldName];
            } else {
                input.value = personalInfo[fieldName];
            }
        }
    });
    
    console.log('个人信息已从本地存储加载');
}

// 显示保存状态
function showSaveStatus(message, isManual = false) {
    // 移除现有的状态提示
    const existingStatus = document.querySelector('.save-status');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    const statusDiv = document.createElement('div');
    statusDiv.className = 'save-status';
    statusDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${isManual ? '#27ae60' : '#3498db'};
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 0.9rem;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: opacity 0.3s ease;
    `;
    statusDiv.textContent = message;
    
    document.body.appendChild(statusDiv);
    
    // 3秒后自动消失（手动保存显示5秒）
    setTimeout(() => {
        statusDiv.style.opacity = '0';
        setTimeout(() => {
            statusDiv.remove();
        }, 300);
    }, isManual ? 5000 : 2000);
}

// 作品集编辑功能
function setupPortfolioEditing() {
    // 只在作品集页面启用此功能
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'portfolio.html') return;
    
    const editBtn = document.getElementById('editPortfolioBtn');
    const addBtn = document.getElementById('addProjectBtn');
    const saveSection = document.getElementById('savePortfolioSection');
    const saveBtn = document.getElementById('savePortfolioBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    
    if (!editBtn) return;
    
    let isEditing = false;
    
    // 编辑模式切换
    editBtn.addEventListener('click', function() {
        if (!isEditing) {
            enableEditingMode();
        } else {
            disableEditingMode();
        }
    });
    
    // 添加新项目
    if (addBtn) {
        addBtn.addEventListener('click', addNewProject);
    }
    
    // 保存修改
    if (saveBtn) {
        saveBtn.addEventListener('click', savePortfolioChanges);
    }
    
    // 取消编辑
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            disableEditingMode();
        });
    }
    
    // 初始化时加载保存的数据
    loadPortfolioData();
    
    function enableEditingMode() {
        isEditing = true;
        editBtn.textContent = '退出编辑';
        editBtn.style.background = '#e74c3c';
        
        if (addBtn) addBtn.style.display = 'inline-block';
        if (saveSection) saveSection.style.display = 'block';
        
        // 启用项目编辑
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            item.classList.add('editing');
            
            // 显示编辑按钮
            const actions = item.querySelector('.project-actions');
            if (actions) actions.style.display = 'block';
            
            // 启用内容编辑
            const editableElements = item.querySelectorAll('[contenteditable]');
            editableElements.forEach(el => {
                el.setAttribute('contenteditable', 'true');
                el.classList.add('editable');
            });
            
            // 添加删除按钮事件
            const deleteBtn = item.querySelector('.btn-delete-project');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    deleteProject(item);
                });
            }
        });
        
        console.log('作品集编辑模式已启用');
    }
    
    function disableEditingMode() {
        isEditing = false;
        editBtn.textContent = '编辑模式';
        editBtn.style.background = '';
        
        if (addBtn) addBtn.style.display = 'none';
        if (saveSection) saveSection.style.display = 'none';
        
        // 禁用项目编辑
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            item.classList.remove('editing');
            
            // 隐藏编辑按钮
            const actions = item.querySelector('.project-actions');
            if (actions) actions.style.display = 'none';
            
            // 禁用内容编辑
            const editableElements = item.querySelectorAll('[contenteditable]');
            editableElements.forEach(el => {
                el.setAttribute('contenteditable', 'false');
                el.classList.remove('editable');
            });
        });
        
        console.log('作品集编辑模式已禁用');
    }
    
    function addNewProject() {
        const portfolioGrid = document.getElementById('portfolioGrid');
        if (!portfolioGrid) return;
        
        const newProjectId = Date.now();
        
        const newProject = document.createElement('div');
        newProject.className = 'portfolio-item editing';
        newProject.setAttribute('data-project-id', newProjectId);
        
        newProject.innerHTML = `
            <div class="portfolio-image">
                <span contenteditable="true">新项目截图</span>
                <div class="project-actions" style="display: block; position: absolute; top: 10px; right: 10px;">
                    <button class="btn-delete-project" style="background: rgba(231,76,60,0.8); color: white; border: none; padding: 5px; border-radius: 3px; cursor: pointer;">🗑️</button>
                </div>
            </div>
            <div class="portfolio-content">
                <h3 contenteditable="true">新项目标题</h3>
                <p><strong>类别：</strong> <span contenteditable="true">Web开发</span></p>
                <p><strong>技术栈：</strong> <span contenteditable="true">请填写技术栈</span></p>
                <p><strong>项目时长：</strong> <span contenteditable="true">请填写时长</span></p>
                <p><strong>成果：</strong> <span contenteditable="true">请填写项目成果</span></p>
                <div class="project-description" style="margin-top: 10px;">
                    <strong>项目描述：</strong>
                    <div contenteditable="true" style="border: 1px dashed #ccc; padding: 10px; border-radius: 5px; margin-top: 5px; min-height: 80px;">请详细描述项目背景、功能和特点...</div>
                </div>
                <button class="btn btn-primary view-details" style="margin-top: 10px;">查看详情</button>
            </div>
        `;
        
        portfolioGrid.insertBefore(newProject, portfolioGrid.firstChild);
        
        // 添加删除按钮事件
        const deleteBtn = newProject.querySelector('.btn-delete-project');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                deleteProject(newProject);
            });
        }
        
        // 添加查看详情功能
        setupViewDetailsFunctionality(newProject);
        
        console.log('新项目已添加');
    }
    
    function deleteProject(projectElement) {
        if (confirm('确定要删除这个项目吗？此操作不可撤销。')) {
            projectElement.remove();
            showSaveStatus('项目已删除');
        }
    }
    
    function savePortfolioChanges() {
        const portfolioData = [];
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach((item, index) => {
            const projectId = item.getAttribute('data-project-id') || `project-${index}`;
            const title = item.querySelector('h3')?.textContent || '';
            const category = item.querySelector('p:nth-child(2) span')?.textContent || '';
            const imageText = item.querySelector('.portfolio-image span')?.innerHTML || '';
            const techStack = item.querySelector('p:nth-child(3) span')?.textContent || '';
            const duration = item.querySelector('p:nth-child(4) span')?.textContent || '';
            const achievements = item.querySelector('p:nth-child(5) span')?.textContent || '';
            const description = item.querySelector('.project-description div')?.textContent || '';
            
            portfolioData.push({
                id: projectId,
                title: title,
                category: category,
                imageText: imageText,
                techStack: techStack,
                duration: duration,
                achievements: achievements,
                description: description
            });
        });
        
        // 保存到localStorage
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        
        showSaveStatus('作品集已保存成功！', true);
        disableEditingMode();
    }
    
    function loadPortfolioData() {
        const savedData = localStorage.getItem('portfolioData');
        if (savedData) {
            const portfolioData = JSON.parse(savedData);
            const portfolioItems = document.querySelectorAll('.portfolio-item');
            
            portfolioData.forEach((project, index) => {
                if (portfolioItems[index]) {
                    const item = portfolioItems[index];
                    
                    // 更新项目内容
                    const titleElement = item.querySelector('h3');
                    const categoryElement = item.querySelector('p:nth-child(2) span');
                    const imageElement = item.querySelector('.portfolio-image span');
                    const techElement = item.querySelector('p:nth-child(3) span');
                    const durationElement = item.querySelector('p:nth-child(4) span');
                    const achievementsElement = item.querySelector('p:nth-child(5) span');
                    const descriptionElement = item.querySelector('.project-description div');
                    
                    if (titleElement) titleElement.textContent = project.title;
                    if (categoryElement) categoryElement.textContent = project.category;
                    if (imageElement) imageElement.innerHTML = project.imageText;
                    if (techElement) techElement.textContent = project.techStack;
                    if (durationElement) durationElement.textContent = project.duration;
                    if (achievementsElement) achievementsElement.textContent = project.achievements;
                    if (descriptionElement) descriptionElement.textContent = project.description;
                }
            });
        }
    }
}

// 为现有项目设置查看详情功能
function setupExistingProjectsViewDetails() {
    console.log('开始初始化现有项目查看详情功能');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    console.log('找到项目数量:', portfolioItems.length);
    
    portfolioItems.forEach((project, index) => {
        console.log(`初始化项目 ${index + 1}`);
        setupViewDetailsFunctionality(project);
    });
    
    console.log('现有项目查看详情功能已初始化');
}

// 查看详情功能设置
function setupViewDetailsFunctionality(projectElement) {
    console.log('开始设置查看详情功能');
    const viewDetailsBtn = projectElement.querySelector('.view-details');
    
    if (!viewDetailsBtn) {
        console.log('找不到查看详情按钮');
        return;
    }
    
    console.log('找到查看详情按钮');
    
    // 使用现有的模态框
    let modal = projectElement.querySelector('.project-details-modal');
    if (!modal) {
        console.log('项目内找不到模态框，尝试在页面中查找');
        // 如果模态框不存在，尝试查找页面中的模态框
        modal = document.querySelector('.project-details-modal');
        if (!modal) {
            console.log('页面中找不到模态框，创建新的模态框');
            modal = createModalForProject(projectElement);
        }
    }
    
    console.log('找到模态框');
    
    // 确保模态框的z-index足够高，不会被其他元素遮挡
    modal.style.zIndex = '10000';
    
    const closeBtn = modal.querySelector('.close-modal');
    
    // 查看详情按钮点击事件
    viewDetailsBtn.addEventListener('click', function() {
        console.log('点击查看详情按钮');
        
        const editBtn = document.getElementById('editPortfolioBtn');
        const isEditing = editBtn && editBtn.textContent === '退出编辑';
        
        console.log('编辑模式状态:', isEditing);
        
        // 确保模态框在最顶层
        modal.style.zIndex = '10000';
        
        if (isEditing) {
            // 编辑模式下启用模态框编辑
            enableModalEditing(modal);
        }
        
        modal.style.display = 'block';
        console.log('模态框显示状态已设置为block');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    });
    
    // 关闭按钮事件
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        const editBtn = document.getElementById('editPortfolioBtn');
        const isEditing = editBtn && editBtn.textContent === '退出编辑';
        if (isEditing) {
            disableModalEditing(modal);
        }
    });
    
    // 点击模态框外部关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            const editBtn = document.getElementById('editPortfolioBtn');
            const isEditing = editBtn && editBtn.textContent === '退出编辑';
            if (isEditing) {
                disableModalEditing(modal);
            }
        }
    });
    
    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            const editBtn = document.getElementById('editPortfolioBtn');
            const isEditing = editBtn && editBtn.textContent === '退出编辑';
            if (isEditing) {
                disableModalEditing(modal);
            }
        }
    });
}

// 创建项目详情模态框
function createModalForProject(projectElement) {
    const modal = document.createElement('div');
    modal.className = 'project-details-modal';
    modal.style.cssText = `
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 800px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    const title = projectElement.querySelector('h3')?.textContent || '项目详情';
    const description = projectElement.querySelector('.project-description div')?.textContent || '项目描述';
    
    modal.innerHTML = `
        <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 contenteditable="false" class="modal-title">${title}</h3>
            <button class="close-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
        </div>
        <div class="modal-content">
            <div class="detail-section">
                <h4 contenteditable="false">项目简介</h4>
                <p contenteditable="false" style="line-height: 1.6;">${description}</p>
            </div>
            <div class="detail-section">
                <h4 contenteditable="false">技术特点</h4>
                <ul contenteditable="false">
                    <li>现代化的技术栈</li>
                    <li>响应式设计</li>
                    <li>用户友好的界面</li>
                </ul>
            </div>
            <div class="detail-section">
                <h4 contenteditable="false">项目成果</h4>
                <p contenteditable="false">项目取得了显著成果，提升了用户体验。</p>
            </div>
        </div>
    `;
    
    projectElement.appendChild(modal);
    return modal;
}

// 启用模态框编辑
function enableModalEditing(modal) {
    const editableElements = modal.querySelectorAll('[contenteditable]');
    editableElements.forEach(el => {
        el.setAttribute('contenteditable', 'true');
        el.classList.add('editable');
    });
    
    // 添加编辑提示（如果还不存在）
    if (!modal.querySelector('.edit-hint')) {
        const editHint = document.createElement('div');
        editHint.className = 'edit-hint';
        editHint.textContent = '编辑模式下：点击内容可直接编辑';
        editHint.style.cssText = 'font-size: 0.9rem; color: #3498db; margin-bottom: 1rem; text-align: center; padding: 0.5rem; background: #f8f9fa; border-radius: 5px;';
        
        const modalHeader = modal.querySelector('.modal-header');
        modalHeader.appendChild(editHint);
    }
}

// 禁用模态框编辑
function disableModalEditing(modal) {
    const editableElements = modal.querySelectorAll('[contenteditable]');
    editableElements.forEach(el => {
        el.setAttribute('contenteditable', 'false');
        el.classList.remove('editable');
    });
    
    // 移除编辑提示
    const editHint = modal.querySelector('.edit-hint');
    if (editHint) {
        editHint.remove();
    }
}

// 页面加载动画
function addLoadingAnimation() {
    // 创建加载动画元素
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #667eea;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        opacity: 1;
        transition: opacity 0.5s ease;
    `;
    
    const loadingContent = document.createElement('div');
    loadingContent.style.cssText = `
        text-align: center;
        color: white;
    `;
    
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 50px;
        height: 50px;
        border: 3px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
        margin: 0 auto 20px;
    `;
    
    const loadingText = document.createElement('p');
    loadingText.textContent = '加载中...';
    loadingText.style.cssText = `
        font-size: 1.2rem;
        margin: 0;
    `;
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    
    loadingContent.appendChild(spinner);
    loadingContent.appendChild(loadingText);
    loadingOverlay.appendChild(loadingContent);
    document.body.appendChild(loadingOverlay);
    document.head.appendChild(style);
    
    // 页面加载完成后淡出动画
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.remove();
            }, 500);
        }, 500);
    });
}

// 页面加载动画
function addLoadingAnimation() {
    // 创建加载动画元素
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #667eea;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        opacity: 1;
        transition: opacity 0.5s ease;
    `;
    
    const loadingContent = document.createElement('div');
    loadingContent.style.cssText = `
        text-align: center;
        color: white;
    `;
    
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 50px;
        height: 50px;
        border: 3px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
        margin: 0 auto 20px;
    `;
    
    const loadingText = document.createElement('p');
    loadingText.textContent = '加载中...';
    loadingText.style.cssText = `
        font-size: 1.2rem;
        margin: 0;
    `;
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    
    loadingContent.appendChild(spinner);
    loadingContent.appendChild(loadingText);
    loadingOverlay.appendChild(loadingContent);
    document.body.appendChild(loadingOverlay);
    document.head.appendChild(style);
    
    // 页面加载完成后淡出动画
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.remove();
            }, 500);
        }, 500);
    });
}