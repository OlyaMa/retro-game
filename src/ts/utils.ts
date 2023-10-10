import Character from "./Character";

/**
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 * */
export function calcTileType(index: number, boardSize: number) {
  const leftArray = [...Array(boardSize - 2)].map((element, index) => {
    element = boardSize + boardSize * index;
    return element;
  });

  const rightArray = [...Array(boardSize - 2)].map((element, index) => {
    element = boardSize * index + boardSize * 2 - 1;
    return element;
  });

  const topArray = [...Array(boardSize - 2)].map((element, index) => {
    element = index + 1;
    return element;
  });

  const bottomArray = [...Array(boardSize - 2)].map((element, index) => {
    element = boardSize ** 2 - boardSize + index + 1;
    return element;
  });

  if (leftArray.includes(index)) return "left";
  if (rightArray.includes(index)) return "right";
  if (topArray.includes(index)) return "top";
  if (bottomArray.includes(index)) return "bottom";
  if (index === 0) return "top-left";
  if (index === boardSize ** 2 - 1) return "bottom-right";
  if (index === boardSize - 1) return "top-right";
  if (index === boardSize ** 2 - boardSize) return "bottom-left";
  return "center";
}

export function calcHealthLevel(health: number) {
  if (health < 15) {
    return "critical";
  }

  if (health < 50) {
    return "normal";
  }

  return "high";
}

export function checkPass(
  character: Character,
  boardSize: number,
  position: number,
) {
  const pass = character.passArea;

  return possiblePassArrayGenerator(pass, boardSize, position);
}

export function checkAttack(
  character: Character,
  boardSize: number,
  position: number,
) {
  const pass = character.attackArea;

  return possibleAttackArrayGenerator(pass, boardSize, position);
}

function possiblePassArrayGenerator(
  pass: number,
  boardSize: number,
  position: number,
) {
  const x0 = position % boardSize;
  const y0 = Math.floor(position / boardSize);
  const passArray: number[] = [];

  for (let dy = -pass; dy <= pass; dy++) {
    for (let dx = -pass; dx <= pass; dx++) {
      if (Math.abs(dx) === Math.abs(dy) || dx === 0 || dy === 0) {
        const newY = y0 + dy;
        const newX = x0 + dx;

        if (
          newX >= 0 &&
          newX < boardSize &&
          newY >= 0 &&
          newY < boardSize &&
          Math.abs(newX - x0) <= pass &&
          Math.abs(newY - y0) <= pass
        ) {
          passArray.push(newY * boardSize + newX);
        }
      }
    }
  }

  return passArray;
}

function possibleAttackArrayGenerator(
  attack: number,
  boardSize: number,
  position: number,
) {
  const x0 = position % boardSize;
  const y0 = Math.floor(position / boardSize);
  const attackArray: number[] = [];

  for (let dy = 0 - attack; dy <= attack; dy++) {
    for (let dx = 0 - attack; dx <= attack; dx++) {
      const radius = Math.abs(dx) + Math.abs(dy);
      if (radius <= attack * 2) {
        const newY = y0 + dy;
        const newX = x0 + dx;

        if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize) {
          attackArray.push(newY * boardSize + newX);
        }
      }
    }
  }

  return attackArray;
}

export function getEuclideanDistance(
  bordSize: number,
  position1: number,
  position2: number,
) {
  const [x0, y0] = [position1 % bordSize, Math.floor(position1 / bordSize)];
  const [x1, y1] = [position2 % bordSize, Math.floor(position2 / bordSize)];

  return Math.sqrt(Math.abs(x1 - x0) ** 2 + Math.abs(y1 - y0) ** 2);
}

export function getTeamCells(rowCells: number, role: string) {
  let allCells = rowCells ** 2 - 1;
  const teamCells = [];
  const rows = (allCells + 1) / rowCells;
  for (let i = 0; i < rows; i++) {
    if (role === "gamer") {
      teamCells.push(allCells - rowCells + 2, allCells - rowCells + 1);
    }
    if (role === "enemy") {
      teamCells.push(allCells, allCells - 1);
    }
    allCells = allCells - rowCells;
  }
  return teamCells;
}