document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadSection = document.getElementById('upload-section');
    const processingSection = document.getElementById('processing-section');
    const resultsSection = document.getElementById('results-section');
    const progress = document.getElementById('progress');
    const loadingText = document.getElementById('loading-text');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const btnReset = document.getElementById('btn-reset');

    // Mock Data
    const mockData = {
        summary: "This document explores the fundamental concepts of artificial neural networks, detailing their architecture inspired by biological brains. It covers feedforward networks, backpropagation algorithms for training, and the significance of activation functions like ReLU and Sigmoid. The text concludes by highlighting recent advancements in deep learning architectures, such as transformers and convolutional networks, and their impact on natural language processing and computer vision.",
        keyPoints: [
            "Neural networks are computational models inspired by biological nervous systems.",
            "Backpropagation is essential for adjusting weights minimizing the error during training.",
            "Activation functions introduce non-linearity, allowing networks to learn complex patterns.",
            "Convolutional Neural Networks (CNNs) excel in spatial data processing like images.",
            "Transformers have revolutionized sequential data handling by relying entirely on attention mechanisms."
        ],
        flashcards: [
            { q: "What is the primary purpose of an activation function?", a: "To introduce non-linearity into the output of a neuron, allowing the network to learn complex patterns." },
            { q: "Define Backpropagation.", a: "An algorithm for training feedforward neural networks that computes the gradient of the loss function with respect to the weights." },
            { q: "What is a major advantage of Transformers over RNNs?", a: "They allow for parallelization during training and use self-attention to handle long-range dependencies effectively." },
            { q: "What type of data are CNNs primarily used for?", a: "Grid-like topology data, most commonly spatial data like images." }
        ],
        qa: [
            { q: "How does a neuron in an artificial neural network process inputs?", a: "It calculates a weighted sum of its inputs, adds a bias, and passes the result through an activation function to determine its output." },
            { q: "Why is the ReLU activation function widely used?", a: "Because it is computationally efficient and helps mitigate the vanishing gradient problem common with Sigmoid or Tanh functions." },
            { q: "What is the role of the loss function?", a: "It measures the difference between the network's predicted output and the actual target value, guiding the training process to minimize this error." }
        ]
    };

    // --- Drag and Drop Handling ---
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    // --- File Processing Simulation ---
    window.handleDemoUpload = () => {
        handleFile(new File(['dummy'], 'demo.pdf'));
    };

    function handleFile(file) {
        // Show processing state
        switchSection(uploadSection, processingSection);
        
        let progressValue = 0;
        const loadingTexts = [
            "Extracting text from document...",
            "Analyzing semantic structure...",
            "Generating executive summary...",
            "Extracting key concepts...",
            "Creating study aids...",
            "Finalizing results..."
        ];

        let textIndex = 0;

        const interval = setInterval(() => {
            progressValue += Math.random() * 15;
            if (progressValue > 100) progressValue = 100;
            
            progress.style.width = `${progressValue}%`;

            if (progressValue % 20 < 5 && textIndex < loadingTexts.length) {
                loadingText.innerText = loadingTexts[textIndex++];
            }

            if (progressValue === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    populateResults();
                    switchSection(processingSection, resultsSection);
                }, 500);
            }
        }, 300);
    }

    function switchSection(hideSec, showSec) {
        hideSec.classList.remove('active');
        setTimeout(() => {
            hideSec.classList.add('hidden');
            showSec.classList.remove('hidden');
            // small delay to allow display:block to render before opacity transition
            setTimeout(() => showSec.classList.add('active'), 50);
        }, 500); // Wait for fade out
    }

    // --- Tabs Handling ---
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active', 'hidden'));
            
            // Add active to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            
            tabPanes.forEach(p => {
                if(p.id === targetId) {
                    p.classList.add('active');
                } else {
                    p.classList.add('hidden');
                }
            });
        });
    });

    // --- Populate Data ---
    let currentCardIndex = 0;

    function populateResults() {
        // Summary
        document.getElementById('summary-content').innerHTML = `<p>${mockData.summary}</p>`;

        // Key Points
        const kpContainer = document.getElementById('key-points-content');
        kpContainer.innerHTML = '';
        mockData.keyPoints.forEach(point => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa-solid fa-check" style="color: var(--primary); margin-right: 10px;"></i> ${point}`;
            kpContainer.appendChild(li);
        });

        // Flashcards
        updateFlashcard();

        // Q&A
        const qaContainer = document.getElementById('qa-content');
        qaContainer.innerHTML = '';
        mockData.qa.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'accordion-item';
            div.innerHTML = `
                <div class="accordion-header" onclick="this.parentElement.classList.toggle('active')">
                    <span>Q: ${item.q}</span>
                    <i class="fa-solid fa-chevron-down transition-transform"></i>
                </div>
                <div class="accordion-content">
                    <p><strong>A:</strong> ${item.a}</p>
                </div>
            `;
            qaContainer.appendChild(div);
        });
    }

    // --- Flashcard Controls ---
    const fcQ = document.getElementById('fc-q');
    const fcA = document.getElementById('fc-a');
    const cardCounter = document.getElementById('card-counter');
    const flashcard = document.getElementById('current-flashcard');

    function updateFlashcard() {
        if(flashcard.classList.contains('flipped')) {
            flashcard.classList.remove('flipped');
            setTimeout(() => setCardData(), 300); // wait for flip back
        } else {
            setCardData();
        }
    }

    function setCardData() {
        fcQ.innerText = mockData.flashcards[currentCardIndex].q;
        fcA.innerText = mockData.flashcards[currentCardIndex].a;
        cardCounter.innerText = `${currentCardIndex + 1} / ${mockData.flashcards.length}`;
    }

    document.getElementById('prev-card').addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentCardIndex > 0) {
            currentCardIndex--;
            updateFlashcard();
        }
    });

    document.getElementById('next-card').addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentCardIndex < mockData.flashcards.length - 1) {
            currentCardIndex++;
            updateFlashcard();
        }
    });

    // --- Reset ---
    btnReset.addEventListener('click', () => {
        progress.style.width = '0%';
        loadingText.innerText = "Analyzing text...";
        currentCardIndex = 0;
        fileInput.value = '';
        switchSection(resultsSection, uploadSection);
    });
});
