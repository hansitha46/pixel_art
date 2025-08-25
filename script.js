document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const gridWidth = document.getElementById('gridWidth');
    const gridHeight = document.getElementById('gridHeight');
    const widthDisplay = document.getElementById('widthDisplay');
    const heightDisplay = document.getElementById('heightDisplay');
    const colorPicker = document.getElementById('colorPicker');
    const createGridBtn = document.getElementById('createGridBtn');
    const paintBtn = document.getElementById('paintBtn');
    const eraseBtn = document.getElementById('eraseBtn');
    const clearBtn = document.getElementById('clearBtn');
    const saveBtn = document.getElementById('saveBtn');
    const viewBtn = document.getElementById('viewBtn');
    const backBtn = document.getElementById('backBtn');
    const pixelGrid = document.getElementById('pixelGrid');
    const gallery = document.getElementById('gallery');
    const drawingsContainer = document.getElementById('drawingsContainer');
    const mainContainer = document.querySelector('.container');

    // App state
    let currentMode = 'paint';
    let isMouseDown = false;
    let drawings = JSON.parse(localStorage.getItem('pixelDrawings')) || [];

    // Initialize the grid
    createGrid(20, 20);

    // Event Listeners for sliders
    gridWidth.addEventListener('input', function() {
        widthDisplay.textContent = `${this.value}px`;
    });

    gridHeight.addEventListener('input', function() {
        heightDisplay.textContent = `${this.value}px`;
    });

    // Create Grid button
    createGridBtn.addEventListener('click', function() {
        createGrid(parseInt(gridWidth.value), parseInt(gridHeight.value));
    });

    // Mode buttons
    paintBtn.addEventListener('click', function() {
        currentMode = 'paint';
        paintBtn.classList.add('active');
        eraseBtn.classList.remove('active');
    });

    eraseBtn.addEventListener('click', function() {
        currentMode = 'erase';
        eraseBtn.classList.add('active');
        paintBtn.classList.remove('active');
    });

    // Clear button
    clearBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear the grid?')) {
            const pixels = document.querySelectorAll('.pixel');
            pixels.forEach(pixel => {
                pixel.style.backgroundColor = 'white';
            });
        }
    });

    // Save button
    saveBtn.addEventListener('click', function() {
        const drawingName = prompt('Enter a name for your drawing:');
        if (drawingName) {
            saveDrawing(drawingName);
        }
    });

    // View gallery button
    viewBtn.addEventListener('click', function() {
        mainContainer.style.display = 'none';
        gallery.style.display = 'block';
        loadGallery();
    });

    // Back button
    backBtn.addEventListener('click', function() {
        gallery.style.display = 'none';
        mainContainer.style.display = 'block';
    });

    // Mouse events for drawing
    document.addEventListener('mousedown', function() {
        isMouseDown = true;
    });

    document.addEventListener('mouseup', function() {
        isMouseDown = false;
    });

    // Prevent dragging on grid
    pixelGrid.addEventListener('dragstart', function(e) {
        e.preventDefault();
    });

    // Create grid function
    function createGrid(width, height) {
        pixelGrid.innerHTML = '';
        pixelGrid.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
        
        for (let i = 0; i < width * height; i++) {
            const pixel = document.createElement('div');
            pixel.classList.add('pixel');
            pixel.style.width = '20px';
            pixel.style.height = '20px';
            
            pixel.addEventListener('mousedown', function() {
                paintPixel(this);
            });
            
            pixel.addEventListener('mouseover', function() {
                if (isMouseDown) {
                    paintPixel(this);
                }
            });
            
            pixelGrid.appendChild(pixel);
        }
    }

    // Paint pixel function
    function paintPixel(pixel) {
        if (currentMode === 'paint') {
            pixel.style.backgroundColor = colorPicker.value;
        } else if (currentMode === 'erase') {
            pixel.style.backgroundColor = 'white';
        }
    }

    // Save drawing function
    function saveDrawing(name) {
    const gridCells = document.querySelectorAll('.pixel');
    const drawingData = [];
    
    // Get the actual grid dimensions from the CSS grid
    const gridComputedStyle = window.getComputedStyle(pixelGrid);
    const gridColumns = gridComputedStyle.gridTemplateColumns.split(' ').length;
    const gridRows = gridComputedStyle.gridTemplateRows.split(' ').length;
    
    gridCells.forEach(cell => {
        // Get the computed background color (not just the inline style)
        const bgColor = window.getComputedStyle(cell).backgroundColor;
        drawingData.push(bgColor);
    });
    
    const drawing = {
        name: name,
        date: new Date().toLocaleString(),
        width: gridColumns,
        height: gridRows,
        data: drawingData
    };
    
    drawings.push(drawing);
    localStorage.setItem('pixelDrawings', JSON.stringify(drawings));
    
    alert('Drawing saved successfully!');
  }

    // Load gallery function
    function loadGallery() {
        drawingsContainer.innerHTML = '';
        
        if (drawings.length === 0) {
            drawingsContainer.innerHTML = '<p>No drawings yet. Create your first masterpiece!</p>';
            return;
        }
        
        drawings.forEach((drawing, index) => {
            const drawingItem = document.createElement('div');
            drawingItem.classList.add('drawing-item');
            
            const preview = document.createElement('div');
            preview.classList.add('drawing-preview');
            
            // Create a mini representation of the drawing
            preview.style.display = 'grid';
            preview.style.gridTemplateColumns = `repeat(${drawing.width}, 1fr)`;
            preview.style.gap = '1px';
            
            drawing.data.forEach(color => {
                const pixel = document.createElement('div');
                pixel.style.backgroundColor = color;
                pixel.style.width = '100%';
                pixel.style.height = '100%';
                preview.appendChild(pixel);
            });
            
            const drawingName = document.createElement('div');
            drawingName.classList.add('drawing-name');
            drawingName.textContent = drawing.name;
            
            const drawingDate = document.createElement('div');
            drawingDate.classList.add('drawing-date');
            drawingDate.textContent = drawing.date;
            
            drawingItem.appendChild(preview);
            drawingItem.appendChild(drawingName);
            drawingItem.appendChild(drawingDate);
            
            drawingItem.addEventListener('click', function() {
                if (confirm('Load this drawing?')) {
                    loadDrawing(index);
                    gallery.style.display = 'none';
                    mainContainer.style.display = 'block';
                }
            });
            
            drawingsContainer.appendChild(drawingItem);
        });
    }

    // Load drawing function
function loadDrawing(index) {
    const drawing = drawings[index];
    
    createGrid(drawing.width, drawing.height);
    
    const pixels = document.querySelectorAll('.pixel');
    drawing.data.forEach((color, i) => {
        if (i < pixels.length) {
            pixels[i].style.backgroundColor = color;
        }
    });
}

    // Initialize with a welcome message
    setTimeout(() => {
        alert('Welcome to Pixel Art Creator! Adjust the grid size and click "Create Grid" to start. Use the controls to create your artwork. Click Save when done!');
    }, 500);
});