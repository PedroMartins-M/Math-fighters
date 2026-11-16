
/* =========================================================
   MATH FIGHTERS
   Arquivo principal: js/main.js
   ========================================================= */


/* =========================================================
   1. ELEMENTOS DO HTML
   ========================================================= */

// Menu principal
const startButton = document.getElementById("start-button");
const preferencesButton = document.getElementById("preferences-button");
const exitButton = document.getElementById("exit-button");

// Painéis
const preferencesPanel = document.getElementById("preferences-panel");
const messagePanel = document.getElementById("message-panel");
const modePanel = document.getElementById("mode-panel");
const setupPanel = document.getElementById("setup-panel");
const characterPanel = document.getElementById("character-panel");

// Mensagens
const messageTitle = document.getElementById("message-title");
const messageText = document.getElementById("message-text");
const closeMessage = document.getElementById("close-message");

// Preferências
const closePreferences = document.getElementById("close-preferences");
const volumeControl = document.getElementById("volume-control");
const volumeValue = document.getElementById("volume-value");
const fullscreenControl = document.getElementById("fullscreen-control");

// Seleção de modo
const soloButton = document.getElementById("solo-button");
const versusButton = document.getElementById("versus-button");
const backModeButton = document.getElementById("back-mode-button");

// Preparação da partida
const difficultySetting = document.getElementById("difficulty-setting");
const difficultySelect = document.getElementById("difficulty-select");
const arenaCards = document.querySelectorAll(".arena-card");
const arenaMessage = document.getElementById("arena-message");
const continueSetup = document.getElementById("continue-setup");
const backSetup = document.getElementById("back-setup");

// Seleção de personagens
const fighterOptions = document.querySelectorAll(".fighter-option");

// Aceita tanto uma imagem diretamente quanto uma div contendo uma imagem
const previewPlayer1 =
    document.querySelector("#preview-player-1 img") ||
    document.getElementById("preview-player-1");

const previewPlayer2 =
    document.querySelector("#preview-player-2 img") ||
    document.getElementById("preview-player-2");

const player1Status = document.getElementById("player-1-status");
const player2Status = document.getElementById("player-2-status");
const player2Area = document.getElementById("player-2-area");
const player2Title = document.getElementById("player-2-title");
const confirmFighters = document.getElementById("confirm-fighters");
const backCharacters = document.getElementById("back-characters");


/* =========================================================
   2. ESTADO DO JOGO
   ========================================================= */

let selectedMode = null;
let selectedArena = null;

let selectedFighters = {
    player1: null,
    player2: null
};

let gameConfig = null;

// Energia
const MAX_POWER = 100;

let playerPower = {
    1: 0,
    2: 0
};

// Vida
const MAX_HEALTH = 100;

let playerLife = {
    1: MAX_HEALTH,
    2: MAX_HEALTH
};

// Estado da partida
let matchOver = false;
let roundFinished = false;
let roundStarting = false;

// Sistema de rounds
const MAX_ROUND_WINS = 2;

let currentRound = 1;

let roundWins = {
    1: 0,
    2: 0
};

// Desafios atuais
let currentChallenges = {
    1: null,
    2: null
};

// Treinamento
const TRAINING_DURATION = 60;

let trainingTimeLeft = TRAINING_DURATION;
let trainingActive = false;
let trainingInterval = null;

// Controle da alternância de jogadores no treinamento
let trainingTurn = 1;
let trainingAdvanceTimeout = null;

// Controle das transições
let roundTransitionTimeout = null;
let roundIntroTimeout = null;


/* =========================================================
   3. CONFIGURAÇÃO DOS ATAQUES
   ========================================================= */

const attackTypes = {
    leve: {
        name: "ATAQUE LEVE",
        cost: 1,
        damage: 5
    },

    contra: {
        name: "CONTRA-ATAQUE",
        cost: 30,
        damage: 15
    },

    especial: {
        name: "ESPECIAL",
        cost: 60,
        damage: 30
    }
};


/* =========================================================
   4. ELEMENTOS DA TELA DE COMBATE
   ========================================================= */

const combatPanel = document.getElementById("combat-panel");
const combatArena = document.getElementById("combat-arena");

const combatPlayer1Name = document.getElementById("combat-player1-name");
const combatPlayer2Name = document.getElementById("combat-player2-name");

const combatFighter1 = document.getElementById("combat-fighter1");
const combatFighter2 = document.getElementById("combat-fighter2");

const fighterContainer1 = document.getElementById("fighter-container-1");
const fighterContainer2 = document.getElementById("fighter-container-2");

const healthPlayer1 = document.getElementById("health-player1");
const healthPlayer2 = document.getElementById("health-player2");

const healthValuePlayer1 = document.getElementById("health-value-player1");
const healthValuePlayer2 = document.getElementById("health-value-player2");

const powerPlayer1 = document.getElementById("power-player1");
const powerPlayer2 = document.getElementById("power-player2");

const powerValuePlayer1 = document.getElementById("power-value-player1");
const powerValuePlayer2 = document.getElementById("power-value-player2");

const exitCombat = document.getElementById("exit-combat");

// Desafios matemáticos
const mathChallengePlayer1 = document.getElementById("math-challenge-player1");
const mathChallengePlayer2 = document.getElementById("math-challenge-player2");
const mathChallenge = document.getElementById("math-challenge");

const mathQuestionPlayer1 = document.getElementById("math-question-player1");
const mathQuestionPlayer2 = document.getElementById("math-question-player2");

const mathAnswerPlayer1 = document.getElementById("math-answer-player1");
const mathAnswerPlayer2 = document.getElementById("math-answer-player2");

const mathFeedbackPlayer1 = document.getElementById("math-feedback-player1");
const mathFeedbackPlayer2 = document.getElementById("math-feedback-player2");

const submitMathAnswerPlayer1 = document.getElementById("submit-math-answer-player1");
const submitMathAnswerPlayer2 = document.getElementById("submit-math-answer-player2");

// Elementos cinematográficos
const roundIntro = document.getElementById("round-intro");
const roundIntroText = document.getElementById("round-intro-text");
const roundFightText = document.getElementById("round-fight-text");

const combatImpact = document.getElementById("combat-impact");
const arenaEffects = document.getElementById("arena-effects");

// Informações da partida
const combatRound = document.getElementById("combat-round");
const combatStatus = document.getElementById("combat-status");
const combatTimer = document.querySelector(".combat-timer");

const player2KeyboardHints =
    document.getElementById("player2-keyboard-hints");


/* =========================================================
   5. CONTROLE DOS PAINÉIS
   ========================================================= */

const panels = [
    preferencesPanel,
    messagePanel,
    modePanel,
    setupPanel,
    characterPanel,
    combatPanel
];

function hideAllPanels() {
    panels.forEach(panel => {
        if (panel) {
            panel.classList.add("hidden");
        }
    });
}

function showPanel(panel) {
    hideAllPanels();

    if (panel) {
        panel.classList.remove("hidden");
    }
}

function showMessage(title, text) {
    if (messageTitle) messageTitle.textContent = title;
    if (messageText) messageText.textContent = text;

    showPanel(messagePanel);
}


/* =========================================================
   6. CONTROLE DE TEMPORIZADORES
   ========================================================= */

function clearTrainingTimers() {
    if (trainingInterval) {
        clearInterval(trainingInterval);
        trainingInterval = null;
    }

    if (trainingAdvanceTimeout) {
        clearTimeout(trainingAdvanceTimeout);
        trainingAdvanceTimeout = null;
    }
}

function clearRoundTimers() {
    if (roundTransitionTimeout) {
        clearTimeout(roundTransitionTimeout);
        roundTransitionTimeout = null;
    }

    if (roundIntroTimeout) {
        clearTimeout(roundIntroTimeout);
        roundIntroTimeout = null;
    }
}


/* =========================================================
   7. PREFERÊNCIAS
   ========================================================= */

// Volume salvo
if (volumeControl) {
    const savedVolume = localStorage.getItem("mathfighters_volume");

    if (savedVolume !== null) {
        volumeControl.value = savedVolume;
    }

    if (volumeValue) {
        volumeValue.textContent = `${volumeControl.value}%`;
    }

    volumeControl.addEventListener("input", () => {
        const volume = volumeControl.value;

        if (volumeValue) {
            volumeValue.textContent = `${volume}%`;
        }

        localStorage.setItem("mathfighters_volume", volume);
    });
}

// Tela cheia
if (fullscreenControl) {
    fullscreenControl.checked =
        localStorage.getItem("mathfighters_fullscreen") === "true";

    fullscreenControl.addEventListener("change", () => {
        localStorage.setItem(
            "mathfighters_fullscreen",
            fullscreenControl.checked
        );
    });
}

async function toggleFullscreen() {
    if (!fullscreenControl) return;

    try {
        if (fullscreenControl.checked) {
            await document.documentElement.requestFullscreen();
        } else if (document.fullscreenElement) {
            await document.exitFullscreen();
        }
    } catch (error) {
        console.error("Erro ao alterar tela cheia:", error);
    }
}

if (fullscreenControl) {
    fullscreenControl.addEventListener("change", toggleFullscreen);
}


/* =========================================================
   8. NAVEGAÇÃO DO MENU
   ========================================================= */

// Iniciar
if (startButton) {
    startButton.addEventListener("click", () => {
        selectedMode = null;
        selectedArena = null;

        selectedFighters = {
            player1: null,
            player2: null
        };

        showPanel(modePanel);
    });
}

// Preferências
if (preferencesButton) {
    preferencesButton.addEventListener("click", () => {
        showPanel(preferencesPanel);
    });
}

if (closePreferences) {
    closePreferences.addEventListener("click", hideAllPanels);
}

if (closeMessage) {
    closeMessage.addEventListener("click", hideAllPanels);
}

// Sair
if (exitButton) {
    exitButton.addEventListener("click", () => {
        showMessage(
            "ATÉ A PRÓXIMA!",
            "Obrigado por jogar Math Fighters!"
        );
    });
}


/* =========================================================
   9. SELEÇÃO DE MODO
   ========================================================= */

if (soloButton) {
    soloButton.addEventListener("click", () => {
        selectedMode = "SOLO";

        if (difficultySetting) {
            difficultySetting.classList.remove("hidden");
        }

        showPanel(setupPanel);
    });
}

if (versusButton) {
    versusButton.addEventListener("click", () => {
        selectedMode = "VERSUS LOCAL";

        if (difficultySetting) {
            difficultySetting.classList.add("hidden");
        }

        showPanel(setupPanel);
    });
}

if (backModeButton) {
    backModeButton.addEventListener("click", () => {
        showPanel(null);
    });
}


/* =========================================================
   10. SELEÇÃO DE ARENA
   ========================================================= */

arenaCards.forEach(card => {
    card.addEventListener("click", () => {
        arenaCards.forEach(item => {
            item.classList.remove("selected");
        });

        card.classList.add("selected");

        selectedArena = card.dataset.arena;

        if (arenaMessage) {
            arenaMessage.textContent = "ARENA SELECIONADA!";
        }

        if (continueSetup) {
            continueSetup.disabled = false;
        }
    });
});

if (continueSetup) {
    continueSetup.addEventListener("click", () => {
        if (!selectedArena) {
            if (arenaMessage) {
                arenaMessage.textContent = "SELECIONE UMA ARENA!";
            }
            return;
        }

        if (!selectedMode) {
            showMessage("ATENÇÃO", "Selecione um modo de jogo.");
            return;
        }

        gameConfig = {
            mode: selectedMode,
            arena: selectedArena,
            difficulty:
                selectedMode === "SOLO"
                    ? (difficultySelect?.value || "intermediario")
                    : "intermediario"
        };

        prepareCharacterSelection();
    });
}

if (backSetup) {
    backSetup.addEventListener("click", () => {
        showPanel(modePanel);
    });
}


/* =========================================================
   11. PREPARAÇÃO DA SELEÇÃO DE PERSONAGENS
   ========================================================= */

function prepareCharacterSelection() {
    selectedFighters = {
        player1: null,
        player2: null
    };

    fighterOptions.forEach(option => {
        option.classList.remove("selected");
    });

    if (previewPlayer1) {
        previewPlayer1.src = "";
    }

    if (previewPlayer2) {
        previewPlayer2.src = "";
    }

    if (player1Status) {
        player1Status.textContent = "ESCOLHA SEU PERSONAGEM";
    }

    if (player2Status) {
        player2Status.textContent = "ESCOLHA SEU PERSONAGEM";
    }

    if (selectedMode === "SOLO") {
        player2Area?.classList.add("hidden");

        if (player2Title) {
            player2Title.textContent = "CPU";
        }
    } else {
        player2Area?.classList.remove("hidden");

        if (player2Title) {
            player2Title.textContent = "PLAYER 2";
        }
    }

    if (confirmFighters) {
        confirmFighters.disabled = true;
    }

    showPanel(characterPanel);
}


/* =========================================================
   12. SELEÇÃO DOS LUTADORES
   ========================================================= */

fighterOptions.forEach(option => {
    option.addEventListener("click", () => {

        // Compatibilidade com os atributos do HTML
        const fighter =
            option.dataset.character ||
            option.dataset.fighter;

        const player = option.dataset.player;

        if (!fighter || !player) return;

        if (player !== "1" && player !== "2") return;

        const playerNumber = Number(player);

        // Impede personagens repetidos no VERSUS
        if (
            selectedMode === "VERSUS LOCAL" &&
            playerNumber === 2 &&
            selectedFighters.player1 === fighter
        ) {
            if (player2Status) {
                player2Status.textContent =
                    "PERSONAGEM JÁ ESCOLHIDO PELO PLAYER 1!";
            }
            return;
        }

        if (
            selectedMode === "VERSUS LOCAL" &&
            playerNumber === 1 &&
            selectedFighters.player2 === fighter
        ) {
            if (player1Status) {
                player1Status.textContent =
                    "PERSONAGEM JÁ ESCOLHIDO PELO PLAYER 2!";
            }
            return;
        }

        selectedFighters[`player${playerNumber}`] = fighter;

        // Atualiza seleção visual
        option.classList.add("selected");

        fighterOptions.forEach(item => {
            if (
                item.dataset.player === player &&
                item !== option
            ) {
                item.classList.remove("selected");
            }
        });

        const preview =
            playerNumber === 1
                ? previewPlayer1
                : previewPlayer2;

        const status =
            playerNumber === 1
                ? player1Status
                : player2Status;

        if (preview) {
            preview.src =
                `assets/images/characters/preview_${fighter}.png`;
        }

        if (status) {
            status.textContent =
                `FIGHTER ${fighter.replace("personagem", "")} SELECIONADO`;
        }

        updateFighterConfirmation();
    });
});


/* =========================================================
   13. CONFIRMAÇÃO DOS PERSONAGENS
   ========================================================= */

function updateFighterConfirmation() {
    if (!confirmFighters) return;

    const player1Ready = selectedFighters.player1 !== null;

    const player2Ready =
        selectedMode === "SOLO" ||
        selectedFighters.player2 !== null;

    confirmFighters.disabled =
        !(player1Ready && player2Ready);
}

if (confirmFighters) {
    confirmFighters.addEventListener("click", () => {
        if (!selectedFighters.player1) {
            showMessage(
                "ATENÇÃO",
                "O PLAYER 1 precisa escolher um personagem."
            );
            return;
        }

        if (
            selectedMode === "VERSUS LOCAL" &&
            !selectedFighters.player2
        ) {
            showMessage(
                "ATENÇÃO",
                "O PLAYER 2 precisa escolher um personagem."
            );
            return;
        }

        // CPU escolhe o personagem oposto
        if (selectedMode === "SOLO") {
            selectedFighters.player2 =
                selectedFighters.player1 === "personagem1"
                    ? "personagem2"
                    : "personagem1";
        }

        startCombat();
    });
}

if (backCharacters) {
    backCharacters.addEventListener("click", () => {
        showPanel(setupPanel);
    });
}


/* =========================================================
   14. DIFICULDADE E RECOMPENSAS
   ========================================================= */

const TRAINING_REWARD = {
    facil: 5,
    iniciante: 5,
    intermediario: 10,
    avancado: 15,
    "muito dificil": 20
};

function getQuestionDifficulty() {
    if (gameConfig?.mode === "SOLO") {
        const difficulty = gameConfig.difficulty || "intermediario";

        return difficulty === "iniciante"
            ? "facil"
            : difficulty;
    }

    return "intermediario";
}

function getDifficultyReward(difficulty) {
    return TRAINING_REWARD[difficulty] || 10;
}



/* =========================================================
   15. GERADOR DE CONTAS
   ========================================================= */

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMathQuestion(difficulty = "intermediario") {
    let number1;
    let number2;
    let answer;
    let expression;

    switch (difficulty) {
        case "facil": {
            const operation = Math.random() < 0.5 ? "+" : "-";

            number1 = randomInt(1, 20);
            number2 = randomInt(1, 20);

            if (operation === "-") {
                // Garante que o resultado não seja negativo.
                if (number2 > number1) {
                    [number1, number2] = [number2, number1];
                }

                answer = number1 - number2;
            } else {
                answer = number1 + number2;
            }

            expression = `${number1} ${operation} ${number2}`;
            break;
        }

        case "avancado": {
            const operation = Math.random() < 0.5 ? "×" : "÷";

            if (operation === "×") {
                number1 = randomInt(5, 20);
                number2 = randomInt(2, 12);

                answer = number1 * number2;
                expression = `${number1} × ${number2}`;
            } else {
                // A divisão sempre terá resultado inteiro.
                answer = randomInt(2, 20);
                number2 = randomInt(2, 12);
                number1 = answer * number2;

                expression = `${number1} ÷ ${number2}`;
            }

            break;
        }

        case "muito dificil": {
            const operation = randomInt(1, 3);

            number1 = randomInt(5, 20);
            number2 = randomInt(2, 15);

            if (operation === 1) {
                answer = (number1 + number2) * 2;
                expression = `(${number1} + ${number2}) × 2`;
            } else if (operation === 2) {
                answer = number1 * number2 - 10;
                expression = `${number1} × ${number2} - 10`;
            } else {
                answer = number1 * 2 + number2;
                expression = `${number1} × 2 + ${number2}`;
            }

            break;
        }

        default: {
            const operation = randomInt(1, 4);

            if (operation === 1) {
                number1 = randomInt(10, 50);
                number2 = randomInt(5, 30);

                answer = number1 + number2;
                expression = `${number1} + ${number2}`;
            } else if (operation === 2) {
                number1 = randomInt(10, 50);
                number2 = randomInt(5, 30);

                if (number2 > number1) {
                    [number1, number2] = [number2, number1];
                }

                answer = number1 - number2;
                expression = `${number1} - ${number2}`;
            } else if (operation === 3) {
                number1 = randomInt(5, 20);
                number2 = randomInt(2, 10);

                answer = number1 * number2;
                expression = `${number1} × ${number2}`;
            } else {
                answer = randomInt(2, 20);
                number2 = randomInt(2, 10);
                number1 = answer * number2;

                expression = `${number1} ÷ ${number2}`;
            }

            break;
        }
    }

    return {
        question: `Quanto é ${expression}?`,
        answer,
        difficulty,
        reward: getDifficultyReward(difficulty)
    };
}



/* =========================================================
   16. ATUALIZAÇÃO DAS BARRAS
   ========================================================= */

function updatePowerBar(player) {
    const power = Math.max(
        0,
        Math.min(MAX_POWER, playerPower[player])
    );

    playerPower[player] = power;

    const bar = player === 1
        ? powerPlayer1
        : powerPlayer2;

    const value = player === 1
        ? powerValuePlayer1
        : powerValuePlayer2;

    if (bar) {
        bar.style.width = `${power}%`;
    }

    if (value) {
        value.textContent = `${power}%`;
    }
}

function updateHealthBar(player) {
    const life = Math.max(
        0,
        Math.min(MAX_HEALTH, playerLife[player])
    );

    playerLife[player] = life;

    const bar = player === 1
        ? healthPlayer1
        : healthPlayer2;

    const value = player === 1
        ? healthValuePlayer1
        : healthValuePlayer2;

    if (bar) {
        bar.style.width = `${life}%`;
    }

    if (value) {
        value.textContent = `${life}%`;
    }
}

function addPower(player, amount) {
    if (matchOver || !trainingActive) return;

    playerPower[player] = Math.min(
        MAX_POWER,
        playerPower[player] + amount
    );

    updatePowerBar(player);
}


/* =========================================================
   17. INICIALIZAÇÃO DA PARTIDA
   ========================================================= */

function startCombat() {
    // Reinicia o estado da partida
    matchOver = false;
    roundFinished = false;
    roundStarting = false;

    clearTrainingTimers();
    clearRoundTimers();

    // Reinicia o placar
    currentRound = 1;

    roundWins = {
        1: 0,
        2: 0
    };

    // Reinicia a vida
    playerLife = {
        1: MAX_HEALTH,
        2: MAX_HEALTH
    };

    // Reinicia a energia
    playerPower = {
        1: 0,
        2: 0
    };

    // Limpa os desafios
    currentChallenges = {
        1: null,
        2: null
    };

    // Configura a arena
    if (combatArena) {
        const arenaImages = {
            cerejeiras: "arena_cerejeiras.png",
            cidade: "arena_cidade_noturna.png"
        };

        const arenaImage = arenaImages[selectedArena];

        if (arenaImage) {
            combatArena.style.backgroundImage =
                `url("assets/images/backgrounds/${arenaImage}")`;
        }
    }

    // Configura o personagem 1
    const fighter1Image =
        `assets/images/characters/${selectedFighters.player1}.png`;

    if (combatFighter1) {
        combatFighter1.src = fighter1Image;

        combatFighter1.onerror = () => {
            console.error(
                "Erro ao carregar o Lutador 1:",
                fighter1Image
            );
        };
    }

    // Configura o personagem 2
    const fighter2Image =
        `assets/images/characters/${selectedFighters.player2}.png`;

    if (combatFighter2) {
        combatFighter2.src = fighter2Image;

        combatFighter2.onerror = () => {
            console.error(
                "Erro ao carregar o Lutador 2:",
                fighter2Image
            );
        };
    }

    // Atualiza as barras
    updateHealthBar(1);
    updateHealthBar(2);

    updatePowerBar(1);
    updatePowerBar(2);

    // Abre a tela de combate
    showPanel(combatPanel);

    // Inicia os 60 segundos de preparação
    startTrainingPhase();

    console.log("COMBATE INICIADO!");
}


/* =========================================================
   18. FASE DE PREPARAÇÃO — 60 SEGUNDOS
   ========================================================= */

function startTrainingPhase() {
    clearTrainingTimers();
    clearRoundTimers();

    trainingTimeLeft = TRAINING_DURATION;
    trainingActive = true;

    roundFinished = false;
    roundStarting = false;

    currentChallenges = {
        1: null,
        2: null
    };

    // No VERSUS, o Player 1 começa
    trainingTurn = 1;

    if (selectedMode === "SOLO") {
        trainingTurn = 1;
    }

    hideMathChallenge(1);
    hideMathChallenge(2);

    if (combatRound) {
        combatRound.textContent = `ROUND ${currentRound}`;
    }

    if (combatStatus) {
        combatStatus.textContent = "FASE DE PREPARAÇÃO";
    }

    if (roundIntro) {
        roundIntro.classList.add("hidden");
    }

    updateTrainingTimer();

    // Abre a primeira questão automaticamente
    openTrainingQuestion(trainingTurn);

    trainingInterval = setInterval(() => {
        trainingTimeLeft--;

        updateTrainingTimer();

        if (trainingTimeLeft <= 0) {
            finishTrainingPhase();
        }
    }, 1000);
}

function updateTrainingTimer() {
    const minutes = Math.floor(trainingTimeLeft / 60);
    const seconds = trainingTimeLeft % 60;

    if (combatTimer) {
        combatTimer.textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
}


/* =========================================================
   19. QUESTÕES DO TREINAMENTO
   ========================================================= */

function openTrainingQuestion(player) {
    if (!trainingActive || matchOver || roundFinished) return;

    // No modo SOLO, somente o jogador participa
    if (selectedMode === "SOLO" && player !== 1) return;

    // Esconde a questão anterior
    hideMathChallenge(player === 1 ? 2 : 1);

    const challenge = generateMathQuestion(
        getQuestionDifficulty()
    );

    challenge.training = true;

    currentChallenges[player] = challenge;

    displayMathChallenge(player, challenge);
}

function advanceTrainingTurn() {
    if (!trainingActive || matchOver || roundFinished) return;

    if (selectedMode === "SOLO") {
        trainingTurn = 1;
    } else {
        trainingTurn = trainingTurn === 1 ? 2 : 1;
    }

    openTrainingQuestion(trainingTurn);
}


/* =========================================================
   20. FINALIZAÇÃO DA PREPARAÇÃO
   ========================================================= */

function finishTrainingPhase() {
    if (!trainingActive) return;

    trainingActive = false;

    clearTrainingTimers();

    currentChallenges = {
        1: null,
        2: null
    };

    hideMathChallenge(1);
    hideMathChallenge(2);

    roundStarting = true;

    if (combatRound) {
        combatRound.textContent = `ROUND ${currentRound}`;
    }

    if (combatTimer) {
        combatTimer.textContent = "FIGHT!";
    }

    if (combatStatus) {
        combatStatus.textContent = "A LUTA COMEÇOU!";
    }

    if (roundIntroText) {
        roundIntroText.textContent = `ROUND ${currentRound}`;
    }

    if (roundFightText) {
        roundFightText.textContent = "FIGHT!";
    }

    if (roundIntro) {
        roundIntro.classList.remove("hidden");
    }

    roundIntroTimeout = setTimeout(() => {
        if (roundIntro) {
            roundIntro.classList.add("hidden");
        }

        roundStarting = false;
        roundIntroTimeout = null;
    }, 1800);
}


/* =========================================================
   21. EXIBIÇÃO DOS DESAFIOS MATEMÁTICOS
   ========================================================= */




function displayMathChallenge(player, challenge) {
    const panel = player === 1
        ? mathChallengePlayer1
        : mathChallengePlayer2;

    const questionElement = player === 1
        ? mathQuestionPlayer1
        : mathQuestionPlayer2;

    const answerInput = player === 1
        ? mathAnswerPlayer1
        : mathAnswerPlayer2;

    const feedback = player === 1
        ? mathFeedbackPlayer1
        : mathFeedbackPlayer2;

    if (!mathChallenge || !panel || !questionElement || !challenge) {
        console.error("Erro ao exibir desafio matemático.");
        return;
    }

    mathChallenge.classList.remove("hidden");
    panel.classList.remove("hidden");

    questionElement.textContent = challenge.question;

    if (answerInput) {
        answerInput.value = "";
    }

    if (feedback) {
        feedback.textContent = "";
    }

    const heading = panel.querySelector(".challenge-heading");

    if (heading) {
        heading.textContent = `PLAYER ${player} - PREPARAÇÃO`;
    }

    answerInput?.focus();
}


function hideMathChallenge(player) {
    const panel = player === 1
        ? mathChallengePlayer1
        : mathChallengePlayer2;

    const answerInput = player === 1
        ? mathAnswerPlayer1
        : mathAnswerPlayer2;

    answerInput?.blur();

    panel?.classList.add("hidden");

    const player1Hidden =
        mathChallengePlayer1?.classList.contains("hidden");

    const player2Hidden =
        mathChallengePlayer2?.classList.contains("hidden");

    if (mathChallenge && player1Hidden && player2Hidden) {
        mathChallenge.classList.add("hidden");
    }
}

/* =========================================================
   22. SISTEMA DE ATAQUES
   ========================================================= */

// Os ataques são executados diretamente pelo teclado.
// As perguntas matemáticas acontecem somente na preparação.



/* =========================================================
   23. VALIDAÇÃO DAS RESPOSTAS
   ========================================================= */


function checkMathAnswer(player) {
    if (
        matchOver ||
        roundFinished ||
        !trainingActive
    ) {
        return;
    }

    const challenge = currentChallenges[player];

    if (!challenge || !challenge.training) return;

    // No VERSUS, somente o jogador da vez pode responder.
    if (selectedMode === "VERSUS LOCAL" && player !== trainingTurn) {
        return;
    }

    const answerInput = player === 1
        ? mathAnswerPlayer1
        : mathAnswerPlayer2;

    const feedback = player === 1
        ? mathFeedbackPlayer1
        : mathFeedbackPlayer2;

    if (!answerInput) return;

    const answerText = answerInput.value.trim();
    const userAnswer = Number(answerText);

    if (answerText === "" || !Number.isFinite(userAnswer)) {
        if (feedback) {
            feedback.textContent = "DIGITE UMA RESPOSTA VÁLIDA!";
        }
        return;
    }

    if (userAnswer !== challenge.answer) {
        if (feedback) {
            feedback.textContent = "RESPOSTA INCORRETA. TENTE NOVAMENTE!";
        }

        answerInput.value = "";
        answerInput.focus();
        return;
    }

    // Resposta correta: concede energia.
    addPower(player, challenge.reward);

    if (feedback) {
        feedback.textContent =
            `CORRETO! +${challenge.reward} DE ENERGIA!`;
    }

    currentChallenges[player] = null;

    trainingAdvanceTimeout = setTimeout(() => {
        trainingAdvanceTimeout = null;
        advanceTrainingTurn();
    }, 450);
}

/* =========================================================
   24. EXECUÇÃO DOS ATAQUES
   ========================================================= */

function executeAttack(player, attackName) {
    if (
        matchOver ||
        trainingActive ||
        roundFinished ||
        roundStarting
    ) {
        return;
    }

    // A CPU ainda não possui comandos de ataque próprios.
    if (player === 2 && selectedMode === "SOLO") {
        return;
    }

    const attack = attackTypes[attackName];

    if (!attack) return;

    // Verifica se o jogador possui energia suficiente.
    if (playerPower[player] < attack.cost) {
        if (combatStatus) {
            combatStatus.textContent =
                `${getPlayerName(player)} NÃO TEM ENERGIA SUFICIENTE!`;
        }

        return;
    }

    // Consome a energia.
    playerPower[player] -= attack.cost;
    updatePowerBar(player);

    // Identifica o adversário.
    const opponent = player === 1 ? 2 : 1;

    // Aplica o dano.
    playerLife[opponent] -= attack.damage;
    playerLife[opponent] = Math.max(0, playerLife[opponent]);

    updateHealthBar(opponent);

    // Atualiza a mensagem.
    if (combatStatus) {
        combatStatus.textContent =
            `${getPlayerName(player)} USOU ${attack.name}!`;
    }

    // Executa os efeitos visuais.
    showAttackEffect(player, attackName);

    // Verifica se o adversário perdeu o round.
    if (playerLife[opponent] <= 0) {
        finishRound(player);
    }
}




/* =========================================================
   25. EFEITOS VISUAIS DOS ATAQUES
   ========================================================= */

function showAttackEffect(player, attackName) {
    const attacker = player === 1
        ? fighterContainer1
        : fighterContainer2;

    const defender = player === 1
        ? fighterContainer2
        : fighterContainer1;

    if (attacker) {
        attacker.classList.remove("attacking", "special-attacking");

        void attacker.offsetWidth;

        attacker.classList.add(
            attackName === "especial"
                ? "special-attacking"
                : "attacking"
        );

        setTimeout(() => {
            attacker.classList.remove(
                "attacking",
                "special-attacking"
            );
        }, 550);
    }

    if (defender) {
        defender.classList.remove("taking-hit");

        void defender.offsetWidth;

        defender.classList.add("taking-hit");

        setTimeout(() => {
            defender.classList.remove("taking-hit");
        }, 400);
    }

    if (combatImpact) {
        combatImpact.textContent =
            attackName === "especial"
                ? "SPECIAL!"
                : attackName === "contra"
                    ? "COUNTER!"
                    : "HIT!";

        combatImpact.classList.remove("hidden", "impact-active");

        void combatImpact.offsetWidth;

        combatImpact.classList.add("impact-active");

        setTimeout(() => {
            combatImpact.classList.remove("impact-active");
            combatImpact.classList.add("hidden");
        }, 450);
    }

    if (combatArena) {
        combatArena.classList.remove("screen-shake");

        void combatArena.offsetWidth;

        combatArena.classList.add("screen-shake");

        setTimeout(() => {
            combatArena.classList.remove("screen-shake");
        }, 350);
    }
}



/* =========================================================
   26. FINALIZAÇÃO DE UM ROUND
   ========================================================= */

function finishRound(winner) {
    if (matchOver || roundFinished) return;

    roundFinished = true;
    trainingActive = false;
    roundStarting = false;

    clearTrainingTimers();
    clearRoundTimers();

    currentChallenges = {
        1: null,
        2: null
    };

    hideMathChallenge(1);
    hideMathChallenge(2);

    // Registra a vitória do round
    roundWins[winner]++;

    const winnerName = getPlayerName(winner);

    if (combatStatus) {
        combatStatus.textContent =
            `${winnerName} VENCEU O ROUND ${currentRound}!`;
    }

    if (roundIntroText) {
        roundIntroText.textContent = `${winnerName} VENCEU!`;
    }

    if (roundFightText) {
        roundFightText.textContent =
            `ROUND ${currentRound} FINALIZADO`;
    }

    if (roundIntro) {
        roundIntro.classList.remove("hidden");
    }

    if (combatTimer) {
        combatTimer.textContent = "ROUND END";
    }

    if (combatRound) {
        combatRound.textContent =
            `ROUND ${currentRound} - ${roundWins[1]} x ${roundWins[2]}`;
    }

    console.log(
        `Round ${currentRound} finalizado. Placar: ${roundWins[1]} x ${roundWins[2]}`
    );

    // Verifica se alguém já venceu dois rounds
    if (roundWins[winner] >= MAX_ROUND_WINS) {
        roundTransitionTimeout = setTimeout(() => {
            roundTransitionTimeout = null;
            finishMatch(winner);
        }, 2500);

        return;
    }

    // Caso contrário, prepara o próximo round
    roundTransitionTimeout = setTimeout(() => {
        roundTransitionTimeout = null;
        startNextRound();
    }, 2500);
}


/* =========================================================
   27. INICIAR O PRÓXIMO ROUND
   ========================================================= */

function startNextRound() {
    if (matchOver) return;

    currentRound++;

    // A vida é restaurada
    playerLife = {
        1: MAX_HEALTH,
        2: MAX_HEALTH
    };

    // IMPORTANTE:
    // A energia NÃO é zerada.
    // Os jogadores mantêm o saldo do round anterior.

    updateHealthBar(1);
    updateHealthBar(2);

    updatePowerBar(1);
    updatePowerBar(2);

    currentChallenges = {
        1: null,
        2: null
    };

    roundFinished = false;

    if (combatStatus) {
        combatStatus.textContent =
            `PREPARE-SE PARA O ROUND ${currentRound}!`;
    }

    // Começa uma nova preparação de 60 segundos
    startTrainingPhase();
}


/* =========================================================
   28. FINALIZAÇÃO DA PARTIDA
   ========================================================= */

function getPlayerName(player) {
    if (player === 1) {
        return selectedMode === "SOLO"
            ? "PLAYER"
            : "PLAYER 1";
    }

    return selectedMode === "SOLO"
        ? "CPU"
        : "PLAYER 2";
}

function finishMatch(winner) {
    if (matchOver) return;

    matchOver = true;
    roundFinished = true;
    trainingActive = false;
    roundStarting = false;

    clearTrainingTimers();
    clearRoundTimers();

    currentChallenges = {
        1: null,
        2: null
    };

    hideMathChallenge(1);
    hideMathChallenge(2);

    const winnerName = getPlayerName(winner);

    if (combatRound) {
        combatRound.textContent = "FIM DE JOGO";
    }

    if (combatTimer) {
        combatTimer.textContent = "VICTORY!";
    }

    if (combatStatus) {
        combatStatus.textContent =
            `${winnerName} VENCEU A PARTIDA!`;
    }

    if (roundIntroText) {
        roundIntroText.textContent = `${winnerName} VENCEU!`;
    }

    if (roundFightText) {
        roundFightText.textContent =
            `${roundWins[1]} x ${roundWins[2]} - VICTORY!`;
    }

    if (roundIntro) {
        roundIntro.classList.remove("hidden");
    }

    console.log(
        `Fim da partida. Vencedor: ${winnerName}. Placar: ${roundWins[1]} x ${roundWins[2]}`
    );
}


/* =========================================================
   29. EVENTOS DOS BOTÕES DE RESPOSTA
   ========================================================= */

if (submitMathAnswerPlayer1) {
    submitMathAnswerPlayer1.addEventListener("click", () => {
        checkMathAnswer(1);
    });
}

if (submitMathAnswerPlayer2) {
    submitMathAnswerPlayer2.addEventListener("click", () => {
        checkMathAnswer(2);
    });
}


/* =========================================================
   30. RESPOSTAS UTILIZANDO ENTER
   ========================================================= */

if (mathAnswerPlayer1) {
    mathAnswerPlayer1.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            checkMathAnswer(1);
        }
    });
}

if (mathAnswerPlayer2) {
    mathAnswerPlayer2.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            checkMathAnswer(2);
        }
    });
}



/* =========================================================
   31. COMANDOS DE ATAQUE PELO TECLADO
   ========================================================= */

document.addEventListener("keydown", event => {
    if (
        matchOver ||
        trainingActive ||
        roundFinished ||
        roundStarting ||
        event.repeat
    ) {
        return;
    }

    if (
        !combatPanel ||
        combatPanel.classList.contains("hidden")
    ) {
        return;
    }

    // Não captura teclas enquanto alguém digita.
    const activeElement = document.activeElement;

    if (
        activeElement &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(activeElement.tagName)
    ) {
        return;
    }

    const key = event.key.toLowerCase();

    // PLAYER 1
    if (key === "a") {
        executeAttack(1, "leve");
    } else if (key === "s") {
        executeAttack(1, "contra");
    } else if (key === "d") {
        executeAttack(1, "especial");
    }

    // PLAYER 2
    if (selectedMode === "VERSUS LOCAL") {
        if (key === "j") {
            executeAttack(2, "leve");
        } else if (key === "k") {
            executeAttack(2, "contra");
        } else if (key === "l") {
            executeAttack(2, "especial");
        }
    }
});



/* =========================================================
   32. SAIR DO COMBATE
   ========================================================= */

if (exitCombat) {
    exitCombat.addEventListener("click", () => {
        trainingActive = false;
        matchOver = true;
        roundFinished = true;
        roundStarting = false;

        clearTrainingTimers();
        clearRoundTimers();

        currentChallenges = {
            1: null,
            2: null
        };

        hideMathChallenge(1);
        hideMathChallenge(2);
        hideAllPanels();

        console.log("Partida encerrada pelo jogador.");
    });
}


/* =========================================================
   33. INICIALIZAÇÃO
   ========================================================= */

hideAllPanels();

console.log("MATH FIGHTERS INICIALIZADO!");
