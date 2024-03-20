const grid = document.getElementById("grid");
let lockGame = false;
let isFirstClick = true;
let numMines;

generateGrid();

function generateGrid() {
    lockGame = false;
    isFirstClick = true;
    grid.innerHTML = "";

    let numRows = prompt("Ingrese el número de filas:");
    numRows = parseInt(numRows);
    if (isNaN(numRows) || numRows < 5) {
        alert("Por favor, ingrese un número válido para el número de filas. Seleccione el boton de reiniciar.");
        return;
    }

    let numCols = prompt("Ingrese el número de columnas:");
    numCols = parseInt(numCols);
    if (isNaN(numCols) || numCols < 5) {
        alert("Por favor, ingrese un número válido para el número de columnas. Seleccione el boton de reiniciar.");
        return;
    }

    if (isFirstClick) {
        numMines = prompt("Ingrese el número de minas:");
        numMines = parseInt(numMines);
        if (isNaN(numMines) || numMines <= 0 || numMines >= numRows * numCols) {
            alert("Por favor, ingrese un número válido para el número de minas. Seleccione el boton de reiniciar.");
            return;
        }
    }

    for (let i = 0; i < numRows; i++) {
        let row = grid.insertRow(i);
        for (let j = 0; j < numCols; j++) {
            let cell = row.insertCell(j);
            cell.onclick = function () { init(this); };
            let mine = document.createAttribute("mine");
            mine.value = "false";
            cell.setAttributeNode(mine);
        }
    }

    if (isFirstClick) {
        generateMines(numMines, numRows, numCols);
    }
}

function generateMines(numMines, numRows, numCols) {
    let cells = grid.getElementsByTagName("td");
    let totalCells = cells.length;

    if (numMines >= totalCells) {
        alert("El número de minas es mayor o igual al número total de celdas. Por favor, ingrese un número menor de minas.");
        return;
    }

    let minesPlaced = 0;
    while (minesPlaced < numMines) {
        let randomIndex = Math.floor(Math.random() * totalCells);
        let cell = cells[randomIndex];

        if (cell.getAttribute("mine") !== "true") {
            cell.setAttribute("mine", "true");
            minesPlaced++;
        }
    }
}

function revealMines() {
    let numRows = grid.rows.length;
    let numCols = grid.rows[0].cells.length;

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            let cell = grid.rows[i].cells[j];
            if (cell.getAttribute("mine") == "true") {
                cell.classList.add("mine");
            }
        }
    }
}

function checkGameComplete() {
    let numRows = grid.rows.length;
    let numCols = grid.rows[0].cells.length;
    let gameComplete = true;

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            let cell = grid.rows[i].cells[j];
            if (cell.getAttribute("mine") == "false" && cell.innerHTML == "") {
                gameComplete = false;
                break;
            }
        }
        if (!gameComplete) {
            break;
        }
    }

    if (gameComplete) {
        alert("¡Has encontrado todas las minas!");
        revealMines();
        restartGame();
    }
}

function restartGame() {
    let confirmRestart = confirm("¿Quieres reiniciar el juego?");
    if (confirmRestart) {
        generateGrid();
    }
}

function init(cell) {
    if (lockGame) {
        return;
    } else {
        if (isFirstClick) {
            if (cell.getAttribute("mine") == "true") {
                generateGrid();
                return;
            }
            isFirstClick = false;
        }

        if (cell.getAttribute("mine") == "true") {
            revealMines();
            lockGame = true;
        } else {
            cell.classList.add("active");
            let mineCount = 0;
            let cellRow = cell.parentNode.rowIndex;
            let cellCol = cell.cellIndex;
            let numRows = grid.rows.length;
            let numCols = grid.rows[0].cells.length;

            for (let i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, numRows - 1); i++) {
                for (let j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, numCols - 1); j++) {
                    if (grid.rows[i].cells[j].getAttribute("mine") == "true") {
                        mineCount++;
                    }
                }
            }
            cell.innerHTML = mineCount;
            if (mineCount == 0) {
                for (let i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, numRows - 1); i++) {
                    for (let j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, numCols - 1); j++) {
                        if (grid.rows[i].cells[j].innerHTML == "") {
                            init(grid.rows[i].cells[j]);
                        }
                    }
                }
            }
            checkGameComplete();
        }
    }
}
