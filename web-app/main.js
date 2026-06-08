import R from "./ramda.js";

const teams = [
    {id: "red",    name: "Red",    icon: "assets/red-piece.svg"   },
    {id: "orange", name: "Orange", icon: "assets/orange-piece.svg"},
    {id: "yellow", name: "Yellow", icon: "assets/yellow-piece.svg"},
    {id: "green",  name: "Green",  icon: "assets/green-piece.svg" },
    {id: "blue",   name: "Blue",   icon: "assets/blue-piece.svg"  },
    {id: "purple", name: "Purple", icon: "assets/purple-piece.svg"}
];

const validCounts = [2, 3, 4, 6];
let currentIndex = 0;
let playerTeams = Array.from({length:validCounts[0]}, () => new Set());

function teamsPerPlayer(playerCount) {
  return Math.floor(teams.length/playerCount);
}

function getClaimedTeams(excludingPlayer) {
  return playerTeams
    .filter((_, i) => i !== excludingPlayer)
    .flatMap(s => [...s]);
}

function toggleTeam(playerIndex, teamId) {
  const selection = playerTeams[playerIndex];
  const cap = teamsPerPlayer(validCounts[currentIndex]);

  if (selection.has(teamId)) {
    selection.delete(teamId);
  } else if (selection.size < cap) {
    selection.add(teamId);
  }

  renderTeamPickers();
}

function renderTeamPickers() {
  const container = document.getElementById('team-pickers');
  container.innerHTML = '';

  playerTeams.forEach((selection, i) => {
    const playerLabel = document.createElement('p');
    playerLabel.textContent = `Player ${i + 1}`;
    container.appendChild(playerLabel);

    const table = document.createElement('table');
    table.classList.add('team-selector');
    const row = document.createElement('tr');

    teams.forEach(team => {
      const cell = document.createElement('td');
      const btn = document.createElement('button');
      btn.classList.add('team-icon');
      btn.dataset.player = i;
      btn.dataset.team = team.id;

      const img = document.createElement('img');
      img.src = team.icon;
      img.alt = team.name;

      btn.appendChild(img);
      cell.appendChild(btn);
      row.appendChild(cell);

      const claimed = getClaimedTeams(i);

      if (claimed.includes(team.id)) {
        btn.style.visibility = 'hidden';
        btn.disabled = true;
      } else {
        btn.style.visibility = 'visible';
        btn.disabled = false;
        btn.classList.toggle('selected', selection.has(team.id));
        btn.addEventListener('click', () => toggleTeam(i, team.id));
      }
    });

    table.appendChild(row);
    container.appendChild(table);
  });
}

function updatePlayerCount() {
  const count = validCounts[currentIndex];
  document.getElementById('player-count-display').textContent = count;
  document.getElementById('decrease').disabled = currentIndex === 0;
  document.getElementById('increase').disabled = currentIndex === validCounts.length - 1;
  playerTeams = Array.from({ length: count }, () => new Set());
  renderTeamPickers();
}

document.getElementById('reset-button').addEventListener('click', () => {
  document.getElementById('default-view').classList.add('hidden');
  document.getElementById('setup-view').classList.remove('hidden');
  updatePlayerCount();
});

document.getElementById('quit-button').addEventListener('click', () => {
  document.getElementById('setup-view').classList.add('hidden');
  document.getElementById('default-view').classList.remove('hidden');
  playerTeams = Array.from({ length: validCounts[currentIndex] }, () => new Set());
  currentIndex = 0;
});

document.getElementById('increase').addEventListener('click', () => {
  if (currentIndex < validCounts.length - 1) {
    currentIndex++;
    updatePlayerCount();
  }
});

document.getElementById('decrease').addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updatePlayerCount();
  }
});

document.getElementById('done-button').addEventListener('click', () => {
  const count = validCounts[currentIndex];
  const cap = teamsPerPlayer(count);
  const teamCounts = playerTeams.map(s => s.size);
  const allEqual = teamCounts.every(c => c === teamCounts[0]);

  if (!allEqual) {
    alert('Each player must have the same number of teams selected.');
    return;
  }

  if (teamCounts[0] === 0) {
    alert('Players must select at least one team.');
    return;
  }

  const selections = playerTeams.map(s => [...s]);
  startGame(count, selections);
});

function startGame(playerCount, playerTeamSelections) {
  document.getElementById('setup-view').classList.add('hidden');
  document.getElementById('default-view').classList.remove('hidden');
  currentPlayer = 0;
  renderGameAside();
}

let currentPlayer = 0;

function renderGameAside() {
  const container = document.getElementById('default-view');
  container.innerHTML = '';

  // current player's teams large at the top
  const currentTeams = document.createElement('div');
  currentTeams.id = 'current-teams';

  playerTeams[currentPlayer].forEach(teamId => {
    const img = document.createElement('img');
    img.src = teams.find(t => t.id === teamId).icon;
    img.alt = teamId;
    img.classList.add('large-icon');
    currentTeams.appendChild(img);
  });

  container.appendChild(currentTeams);

  // other players' teams small at the bottom
  const otherTeams = document.createElement('div');
  otherTeams.id = 'other-teams';

  playerTeams.forEach((selection, i) => {
    if (i === currentPlayer) return;

    const playerGroup = document.createElement('div');
    playerGroup.classList.add('other-player-group');

    selection.forEach(teamId => {
      const img = document.createElement('img');
      img.src = teams.find(t => t.id === teamId).icon;
      img.alt = teamId;
      img.classList.add('small-icon');
      playerGroup.appendChild(img);
    });

    otherTeams.appendChild(playerGroup);
  });

  container.appendChild(otherTeams);
}