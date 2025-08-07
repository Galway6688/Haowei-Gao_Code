// Global variables
let currentTab = 'multimodal';
let currentMode = 'tactile-text';
let currentQAMode = 'single-qa';
let exampleCount = 1;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeModeSelectors();
    initializeFileUploads();
    initializePromptOptions();
});

// Tab Management
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');

    currentTab = tabName;
}

// Mode Selectors
function initializeModeSelectors() {
    // Multimodal analysis modes
    const analysisModeBtns = document.querySelectorAll('#multimodal .mode-btn');
    analysisModeBtns.forEach(button => {
        button.addEventListener('click', function() {
            const mode = this.getAttribute('data-mode');
            switchAnalysisMode(mode);
        });
    });

    // QA modes
    const qaModeButtons = document.querySelectorAll('#qa .mode-btn');
    qaModeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mode = this.getAttribute('data-mode');
            switchQAMode(mode);
        });
    });
}

function switchAnalysisMode(mode) {
    // Update mode buttons
    document.querySelectorAll('#multimodal .mode-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`#multimodal [data-mode="${mode}"]`).classList.add('active');

    // Update mode content
    document.querySelectorAll('.analysis-form').forEach(form => form.classList.remove('active'));
    document.getElementById(`${mode}-mode`).classList.add('active');

    currentMode = mode;
}

function switchQAMode(mode) {
    // Update mode buttons
    document.querySelectorAll('#qa .mode-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`#qa [data-mode="${mode}"]`).classList.add('active');

    // Update mode content
    document.querySelectorAll('.qa-form').forEach(form => form.classList.remove('active'));
    document.getElementById(`${mode}-mode`).classList.add('active');

    currentQAMode = mode;
}

// File Upload Handling
function initializeFileUploads() {
    // Image file inputs
    const fileInputs = [
        { input: 'image-file', display: 'image-filename' },
        { input: 'complete-image-file', display: 'complete-image-filename' },
        { input: 'dual-image-file', display: 'dual-image-filename' },
        { input: 'new-image-file', display: 'new-image-filename' }
    ];

    fileInputs.forEach(({ input, display }) => {
        const fileInput = document.getElementById(input);
        if (fileInput) {
            fileInput.addEventListener('change', function() {
                const filename = this.files[0] ? this.files[0].name : '';
                document.getElementById(display).textContent = filename;
            });
        }
    });
}

// Prompt Options
function initializePromptOptions() {
    const customPromptCheckbox = document.getElementById('use-custom-prompt');
    const customPromptSection = document.getElementById('custom-prompt-section');

    if (customPromptCheckbox) {
        customPromptCheckbox.addEventListener('change', function() {
            if (this.checked) {
                customPromptSection.classList.remove('hidden');
            } else {
                customPromptSection.classList.add('hidden');
            }
        });
    }
}

// API Calls and Analysis Functions

// Tactile-Text Analysis
async function analyzeTactileText() {
    const tactileData = document.getElementById('tactile-data').value;
    const taskInstruction = document.getElementById('task-instruction').value;
    const useCustomPrompt = document.getElementById('use-custom-prompt').checked;
    const customPrompt = document.getElementById('custom-prompt').value;

    if (!tactileData || !taskInstruction) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }

    const requestData = {
        tactile_data: tactileData,
        task_instruction: taskInstruction,
        use_custom_prompt: useCustomPrompt,
        custom_prompt: customPrompt || null
    };

    try {
        showLoading(true);
        const response = await fetch('/api/multimodal/tactile-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const result = await response.json();
        displayResults(result);
    } catch (error) {
        showMessage('Error processing request: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Vision-Text Analysis
async function analyzeVisionText() {
    const textDescription = document.getElementById('text-description').value;
    const taskInstruction = document.getElementById('vision-task').value;
    const imageFile = document.getElementById('image-file').files[0];

    if (!textDescription || !taskInstruction || !imageFile) {
        showMessage('Please fill in all required fields and upload an image', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('text_description', textDescription);
    formData.append('task_instruction', taskInstruction);
    formData.append('image', imageFile);
    formData.append('use_custom_prompt', false);

    try {
        showLoading(true);
        const response = await fetch('/api/multimodal/vision-text', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        displayResults(result);
    } catch (error) {
        showMessage('Error processing request: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Complete Multimodal Analysis
async function analyzeComplete() {
    const tactileData = document.getElementById('complete-tactile').value;
    const textDescription = document.getElementById('complete-text').value;
    const taskInstruction = document.getElementById('complete-task').value;
    const imageFile = document.getElementById('complete-image-file').files[0];

    if (!tactileData || !textDescription || !taskInstruction || !imageFile) {
        showMessage('Please fill in all required fields and upload an image', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('tactile_data', tactileData);
    formData.append('text_description', textDescription);
    formData.append('task_instruction', taskInstruction);
    formData.append('image', imageFile);
    formData.append('use_custom_prompt', false);

    try {
        showLoading(true);
        const response = await fetch('/api/multimodal/multimodal-complete', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        displayResults(result);
    } catch (error) {
        showMessage('Error processing request: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Question Answering Functions

// Single Modality QA
async function askSingleModalityQuestion() {
    const question = document.getElementById('qa-question').value;
    const modalityType = document.getElementById('modality-type').value;
    const modalityData = document.getElementById('modality-data').value;

    if (!question || !modalityData) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }

    const requestData = {
        question: question,
        modality_type: modalityType,
        modality_data: modalityData
    };

    try {
        showLoading(true);
        const response = await fetch('/api/qa/single-modality', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const result = await response.json();
        displayQAResults(result);
    } catch (error) {
        showMessage('Error processing request: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Dual Modality QA
async function askDualModalityQuestion() {
    const question = document.getElementById('dual-question').value;
    const tactileData = document.getElementById('dual-tactile').value;
    const textData = document.getElementById('dual-text').value;
    const imageFile = document.getElementById('dual-image-file').files[0];

    if (!question) {
        showMessage('Please enter a question', 'error');
        return;
    }

    if (!tactileData && !textData && !imageFile) {
        showMessage('Please provide at least one type of data', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('question', question);
    if (tactileData) formData.append('tactile_data', tactileData);
    if (textData) formData.append('text_data', textData);
    if (imageFile) formData.append('image', imageFile);

    try {
        showLoading(true);
        const response = await fetch('/api/qa/dual-modality', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        displayQAResults(result);
    } catch (error) {
        showMessage('Error processing request: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Few-Shot Learning
async function performFewShotLearning() {
    const examples = collectExamples();
    const newTactile = document.getElementById('new-tactile').value;
    const newText = document.getElementById('new-text').value;
    const newImageFile = document.getElementById('new-image-file').files[0];

    if (examples.length === 0 || !newTactile || !newText) {
        showMessage('Please provide at least one example and fill in the new input fields', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('examples_json', JSON.stringify(examples));
    formData.append('tactile_data', newTactile);
    formData.append('text_description', newText);
    if (newImageFile) formData.append('image', newImageFile);

    try {
        showLoading(true);
        const response = await fetch('/api/multimodal/few-shot-learning', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        displayFewShotResults(result);
    } catch (error) {
        showMessage('Error processing request: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

function collectExamples() {
    const examples = [];
    const exampleItems = document.querySelectorAll('.example-item');

    exampleItems.forEach(item => {
        const tactile = item.querySelector('.example-tactile').value;
        const text = item.querySelector('.example-text').value;
        const output = item.querySelector('.example-output').value;

        if (tactile || text || output) {
            examples.push({
                tactile: tactile,
                text: text,
                output: output
            });
        }
    });

    return examples;
}

function addExample() {
    exampleCount++;
    const container = document.getElementById('examples-container');
    const exampleHtml = `
        <div class="example-item">
            <h4>Example ${exampleCount}</h4>
            <div class="input-grid">
                <div class="input-group">
                    <label>Tactile Data</label>
                    <textarea class="example-tactile" placeholder="Example tactile data..."></textarea>
                </div>
                <div class="input-group">
                    <label>Text Context</label>
                    <textarea class="example-text" placeholder="Example text..."></textarea>
                </div>
                <div class="input-group">
                    <label>Expected Output</label>
                    <textarea class="example-output" placeholder="Expected analysis result..."></textarea>
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', exampleHtml);
}

// Template Management
async function loadAvailableTemplates() {
    try {
        showLoading(true);
        const response = await fetch('/api/multimodal/available-templates');
        const result = await response.json();

        if (result.success) {
            displayTemplates(result.templates);
        } else {
            showMessage('Error loading templates', 'error');
        }
    } catch (error) {
        showMessage('Error loading templates: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

function displayTemplates(templates) {
    const container = document.getElementById('templates-list');
    container.innerHTML = '<h4>Available Templates:</h4>';
    
    templates.forEach(template => {
        const templateDiv = document.createElement('div');
        templateDiv.className = 'template-item';
        templateDiv.innerHTML = `
            <div style="padding: 10px; margin: 5px 0; background: #f8f9fa; border-radius: 5px;">
                <strong>${template}</strong>
            </div>
        `;
        container.appendChild(templateDiv);
    });
}

async function createCustomTemplate() {
    const name = document.getElementById('template-name').value;
    const content = document.getElementById('template-content').value;
    const requiredInputs = document.getElementById('required-inputs').value;

    if (!name || !content || !requiredInputs) {
        showMessage('Please fill in all template fields', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('template', content);
    formData.append('required_inputs', requiredInputs);

    try {
        showLoading(true);
        const response = await fetch('/api/multimodal/custom-template', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            showMessage('Template created successfully!', 'success');
            // Clear form
            document.getElementById('template-name').value = '';
            document.getElementById('template-content').value = '';
            document.getElementById('required-inputs').value = '';
        } else {
            showMessage('Error creating template', 'error');
        }
    } catch (error) {
        showMessage('Error creating template: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function loadModelInfo() {
    try {
        showLoading(true);
        const response = await fetch('/api/multimodal/model-info');
        const result = await response.json();

        if (result.success) {
            displayModelInfo(result.model_info);
        } else {
            showMessage('Error loading model information', 'error');
        }
    } catch (error) {
        showMessage('Error loading model information: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

function displayModelInfo(modelInfo) {
    const container = document.getElementById('model-status');
    container.innerHTML = `
        <div style="background: white; padding: 15px; border-radius: 8px;">
            <h4>Current Model Configuration:</h4>
            <pre>${JSON.stringify(modelInfo, null, 2)}</pre>
        </div>
    `;
}

async function loadSampleQuestions() {
    try {
        const response = await fetch('/api/qa/sample-questions');
        const result = await response.json();

        if (result.success) {
            displaySampleQuestions(result.sample_questions);
        } else {
            showMessage('Error loading sample questions', 'error');
        }
    } catch (error) {
        showMessage('Error loading sample questions: ' + error.message, 'error');
    }
}

function displaySampleQuestions(questions) {
    const container = document.getElementById('question-examples');
    container.innerHTML = '<h4>Sample Questions:</h4>';

    // Single modality questions
    Object.entries(questions.single_modality).forEach(([modality, questionList]) => {
        const modalityDiv = document.createElement('div');
        modalityDiv.innerHTML = `<h5>${modality.charAt(0).toUpperCase() + modality.slice(1)} Questions:</h5>`;
        
        questionList.forEach(question => {
            const btn = document.createElement('button');
            btn.className = 'example-btn';
            btn.textContent = question;
            btn.onclick = () => {
                if (currentQAMode === 'single-qa') {
                    document.getElementById('qa-question').value = question;
                    document.getElementById('modality-type').value = modality;
                }
            };
            modalityDiv.appendChild(btn);
        });
        
        container.appendChild(modalityDiv);
    });

    // Dual modality questions
    const dualDiv = document.createElement('div');
    dualDiv.innerHTML = '<h5>Dual Modality Questions:</h5>';
    questions.dual_modality.forEach(question => {
        const btn = document.createElement('button');
        btn.className = 'example-btn';
        btn.textContent = question;
        btn.onclick = () => {
            if (currentQAMode === 'dual-qa') {
                document.getElementById('dual-question').value = question;
            }
        };
        dualDiv.appendChild(btn);
    });
    container.appendChild(dualDiv);
}

// Display Functions
function displayResults(result) {
    const resultsSection = document.getElementById('analysis-results');
    const resultText = document.getElementById('result-text');
    const promptDisplay = document.getElementById('prompt-display');
    const modelInfoDisplay = document.getElementById('model-info-display');

    if (result.success) {
        resultText.textContent = result.response;
        promptDisplay.textContent = result.prompt_used || 'No prompt information available';
        modelInfoDisplay.textContent = JSON.stringify(result.model_info || {}, null, 2);
        resultsSection.classList.remove('hidden');
        showMessage('Analysis completed successfully!', 'success');
    } else {
        showMessage('Analysis failed: ' + (result.error || 'Unknown error'), 'error');
    }
}

function displayQAResults(result) {
    const resultsSection = document.getElementById('qa-results');
    const answerText = document.getElementById('answer-text');
    const modalitiesUsed = document.getElementById('modalities-used');
    const originalQuestion = document.getElementById('original-question');

    if (result.success) {
        answerText.textContent = result.answer;
        modalitiesUsed.textContent = result.modalities_used.join(', ');
        originalQuestion.textContent = result.question;
        resultsSection.classList.remove('hidden');
        showMessage('Question answered successfully!', 'success');
    } else {
        showMessage('Question answering failed: ' + (result.error || 'Unknown error'), 'error');
    }
}

function displayFewShotResults(result) {
    const resultsSection = document.getElementById('few-shot-results');
    const resultText = document.getElementById('few-shot-result-text');

    if (result.success) {
        resultText.textContent = result.response;
        resultsSection.classList.remove('hidden');
        showMessage('Few-shot learning completed successfully!', 'success');
    } else {
        showMessage('Few-shot learning failed: ' + (result.error || 'Unknown error'), 'error');
    }
}

// Utility Functions
function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (show) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

function showMessage(message, type) {
    const container = document.getElementById('message-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    container.appendChild(messageDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
} 