
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

// Desempate: morte súbita (quando os dois ficam sem energia com a mesma vida)
let suddenDeath = { active: false, challenge: null };
let suddenDeathCpuTimeout = null;

// Controle da CPU (modo SOLO)
let cpuTrainingInterval = null;
let cpuFightInterval = null;

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
SISTEMA DE SPRITES E ANIMAÇÕES
========================================================= */

const spriteSheets = {
    personagem1: "assets/images/characters/personagem1.png",
    personagem2: "assets/images/characters/personagem2.png"
};

// Recortes (x, y, w, h) de cada pose na spritesheet de cada lutador.
//   ax = posição horizontal da cabeça dentro do recorte (âncora)
//   g  = distância do topo do recorte até o chão (alinha os pés)
const spriteFrames = {
    personagem1: {
        entrada: [
            {x: 30, y: 67, w: 102, h: 218, ax: 64.0, g: 216},
            {x: 165, y: 66, w: 110, h: 217, ax: 69.0, g: 217},
            {x: 304, y: 66, w: 97, h: 215, ax: 59.0, g: 217},
            {x: 429, y: 66, w: 131, h: 216, ax: 74.5, g: 217},
            {x: 578, y: 69, w: 89, h: 214, ax: 51.5, g: 214},
            {x: 687, y: 74, w: 126, h: 209, ax: 67.0, g: 209}
        ],
        andar: [
            {x: 842, y: 81, w: 100, h: 200, ax: 71.5, g: 201},
            {x: 942, y: 80, w: 103, h: 201, ax: 75.5, g: 202},
            {x: 1060, y: 82, w: 102, h: 201, ax: 74.0, g: 200},
            {x: 1168, y: 81, w: 110, h: 202, ax: 70.5, g: 201},
            {x: 1290, y: 80, w: 89, h: 203, ax: 56.5, g: 202},
            {x: 1393, y: 83, w: 95, h: 198, ax: 62.0, g: 199}
        ],
        leve: [
            {x: 19, y: 375, w: 143, h: 191, ax: 91, g: 191},
            {x: 170, y: 379, w: 108, h: 187, ax: 75, g: 187},
            {x: 294, y: 377, w: 134, h: 188, ax: 71, g: 189},
            {x: 440, y: 379, w: 152, h: 185, ax: 45, g: 187},
            {x: 598, y: 377, w: 136, h: 189, ax: 67, g: 189}
        ],
        pesado: [
            {x: 783, y: 395, w: 160, h: 171, ax: 122, g: 171},
            {x: 974, y: 352, w: 352, h: 214, ax: 156, g: 214},
            {x: 1356, y: 388, w: 137, h: 178, ax: 114, g: 178}
        ],
        contra: [
            {x: 19, y: 665, w: 145, h: 203, ax: 66, g: 206},
            {x: 190, y: 665, w: 160, h: 211, ax: 80, g: 206},
            {x: 358, y: 671, w: 238, h: 194, ax: 117, g: 200},
            {x: 598, y: 669, w: 177, h: 206, ax: 82, g: 202}
        ],
        especial: [
            {x: 775, y: 695, w: 153, h: 201, ax: 75, g: 202},
            {x: 932, y: 635, w: 147, h: 261, ax: 73, g: 262},
            {x: 1104, y: 647, w: 192, h: 252, ax: 66, g: 250},
            {x: 1296, y: 644, w: 226, h: 256, ax: 44, g: 253}
        ]
    },
    personagem2: {
        entrada: [
            {x: 39, y: 67, w: 93, h: 226, ax: 57.5, g: 226},
            {x: 200, y: 68, w: 88, h: 225, ax: 52.0, g: 225},
            {x: 361, y: 72, w: 90, h: 221, ax: 56.0, g: 221},
            {x: 517, y: 72, w: 86, h: 221, ax: 47.0, g: 221},
            {x: 681, y: 79, w: 72, h: 214, ax: 42.0, g: 214}
        ],
        andar: [
            {x: 855, y: 78, w: 97, h: 215, ax: 65.5, g: 215},
            {x: 1001, y: 84, w: 89, h: 209, ax: 61.0, g: 209},
            {x: 1134, y: 90, w: 95, h: 203, ax: 65.5, g: 203},
            {x: 1265, y: 89, w: 95, h: 204, ax: 66.0, g: 204},
            {x: 1392, y: 90, w: 101, h: 203, ax: 64.5, g: 203}
        ],
        leve: [
            {x: 42, y: 379, w: 120, h: 187, ax: 58, g: 187},
            {x: 194, y: 382, w: 107, h: 184, ax: 71, g: 184},
            {x: 349, y: 375, w: 203, h: 191, ax: 61, g: 191},
            {x: 615, y: 376, w: 100, h: 190, ax: 50, g: 190}
        ],
        pesado: [
            {x: 796, y: 381, w: 144, h: 185, ax: 99, g: 185},
            {x: 962, y: 357, w: 360, h: 209, ax: 128, g: 209},
            {x: 1361, y: 401, w: 116, h: 165, ax: 84, g: 165}
        ],
        contra: [
            {x: 24, y: 668, w: 157, h: 214, ax: 66, g: 202},
            {x: 182, y: 656, w: 190, h: 205, ax: 63, g: 214},
            {x: 381, y: 655, w: 193, h: 213, ax: 94, g: 215},
            {x: 602, y: 669, w: 127, h: 204, ax: 68, g: 201}
        ],
        especial: [
            {x: 778, y: 653, w: 170, h: 241, ax: 97, g: 247},
            {x: 999, y: 653, w: 320, h: 247, ax: 116, g: 247},
            {x: 1322, y: 664, w: 182, h: 236, ax: 83, g: 236}
        ]
    }
};

// Pose parada = primeira pose da entrada
Object.values(spriteFrames).forEach(character => {
    character.parado = [character.entrada[0]];
});

// Velocidade (ms por frame) e repetição de cada animação
const animationSettings = {
    entrada: { speed: 130, loop: false },
    parado: { speed: 200, loop: true },
    andar: { speed: 100, loop: true },
    leve: { speed: 90, loop: false },
    pesado: { speed: 140, loop: false },
    contra: { speed: 110, loop: false },
    especial: { speed: 150, loop: false }
};

// Altura de referência de um lutador em pé (px da spritesheet).
// Todas as poses usam a mesma escala, então o lutador não "pulsa".
const SPRITE_REFERENCE_HEIGHT = 215;

const fighterSpriteStates = {
    1: { image: null, character: null, animation: "entrada", frame: 0, timer: null },
    2: { image: null, character: null, animation: "entrada", frame: 0, timer: null }
};

function getFighterFrames(state) {
    return spriteFrames[state.character]?.[state.animation];
}

function drawFighterFrame(player) {
    const state = fighterSpriteStates[player];

    const canvas = player === 1
        ? combatFighter1
        : combatFighter2;

    if (!state.image || !state.character || !canvas) return;

    const frames = getFighterFrames(state);
    const frame = frames && frames[state.frame];
    if (!frame) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (!width || !height) return;

    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio || 1;

    const pixelWidth = Math.round(width * pixelRatio);
    const pixelHeight = Math.round(height * pixelRatio);

    // Só redimensiona quando preciso (redimensionar apaga o canvas)
    if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
    if (canvas.height !== pixelHeight) canvas.height = pixelHeight;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const scale = (height * 0.92) / SPRITE_REFERENCE_HEIGHT;

    const drawWidth = frame.w * scale;
    const drawHeight = frame.h * scale;

    // Cabeça no centro do canvas e pés sempre na mesma linha do chão
    const drawX = width / 2 - frame.ax * scale;
    const groundY = height * 0.98;
    const drawY = groundY - frame.g * scale;

    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
        state.image,
        frame.x,
        frame.y,
        frame.w,
        frame.h,
        drawX,
        drawY,
        drawWidth,
        drawHeight
    );
}

function stopFighterTimer(state) {
    if (state && state.timer) {
        clearInterval(state.timer);
        state.timer = null;
    }
}

function setFighterAnimation(player, animationName) {
    const state = fighterSpriteStates[player];
    const settings = animationSettings[animationName];

    if (!state || !state.image || !state.character || !settings) return;

    state.animation = animationName;

    const frames = getFighterFrames(state);
    if (!frames) return;

    stopFighterTimer(state);

    state.frame = 0;
    drawFighterFrame(player);

    // Animação de um único frame que repete: não precisa de timer.
    if (settings.loop && frames.length <= 1) return;

    state.timer = setInterval(() => {
        state.frame++;

        if (state.frame >= frames.length) {
            if (settings.loop) {
                state.frame = 0;
            } else {
                // Terminou: volta para a pose parada
                setFighterAnimation(player, "parado");
                return;
            }
        }

        drawFighterFrame(player);
    }, settings.speed);
}

function stopFighterSprites() {
    stopFighterTimer(fighterSpriteStates[1]);
    stopFighterTimer(fighterSpriteStates[2]);
}

// Qual animação da spritesheet cada ataque usa
const attackSpriteAnimations = {
    leve: "leve",
    contra: "contra",
    especial: "especial"
};

function playAttackSprite(player, attackName) {
    const animationName = attackSpriteAnimations[attackName];

    if (animationName) {
        setFighterAnimation(player, animationName);
    }
}

window.addEventListener("resize", () => {
    drawFighterFrame(1);
    drawFighterFrame(2);
});

function loadFighterSprite(player) {
    const fighter = selectedFighters[`player${player}`];
    const state = fighterSpriteStates[player];

    if (!fighter || !state) return;

    if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
    }

    const image = new Image();

    state.image = null;
    state.character = fighter;

    image.onload = () => {
        state.image = image;
        setFighterAnimation(player, "entrada");
    };

    image.onerror = () => {
        console.error("Não foi possível carregar a spritesheet:", image.src);
    };

    image.src = spriteSheets[fighter];
}


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
    if (cpuTrainingInterval) {
        clearInterval(cpuTrainingInterval);
        cpuTrainingInterval = null;
    }

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
    if (suddenDeathCpuTimeout) {
        clearTimeout(suddenDeathCpuTimeout);
        suddenDeathCpuTimeout = null;
    }

    suddenDeath = { active: false, challenge: null };

    if (cpuFightInterval) {
        clearInterval(cpuFightInterval);
        cpuFightInterval = null;
    }

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
async function toggleFullscreen() {
    if (!fullscreenControl) return;

    try {
        if (fullscreenControl.checked) {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            }
        } else if (document.fullscreenElement) {
            await document.exitFullscreen();
        }
    } catch (error) {
        console.error("Erro ao alterar tela cheia:", error);
        fullscreenControl.checked = Boolean(document.fullscreenElement);
    }
}

if (fullscreenControl) {
    // O navegador só libera tela cheia após um clique do jogador,
    // então o estado salvo não é aplicado sozinho ao abrir a página.
    fullscreenControl.checked = Boolean(document.fullscreenElement);

    fullscreenControl.addEventListener("change", toggleFullscreen);

    // Mantém o checkbox sincronizado (ex.: jogador apertou ESC).
    document.addEventListener("fullscreenchange", () => {
        fullscreenControl.checked = Boolean(document.fullscreenElement);

        localStorage.setItem(
            "mathfighters_fullscreen",
            fullscreenControl.checked
        );
    });
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

        // Limpa a seleção de arena da partida anterior
        arenaCards.forEach(card => card.classList.remove("selected"));

        if (arenaMessage) {
            arenaMessage.textContent = "ESCOLHA UMA ARENA";
        }

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

    // Mostra o preview padrão "apagado" até o jogador escolher
    // (antes usava src = "", que gerava imagem quebrada).
    if (previewPlayer1) {
        previewPlayer1.src = "assets/images/characters/preview_personagem1.png";
        previewPlayer1.style.opacity = "0.35";
    }

    if (previewPlayer2) {
        previewPlayer2.src = "assets/images/characters/preview_personagem2.png";
        previewPlayer2.style.opacity = "0.35";
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
            preview.style.opacity = "1";
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
        value.textContent = `${power}/${MAX_POWER}`;
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
        value.textContent = `${life}`;
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

    // Nomes no HUD (PLAYER / CPU no modo SOLO)
    if (combatPlayer1Name) {
        combatPlayer1Name.textContent = getPlayerName(1);
    }

    if (combatPlayer2Name) {
        combatPlayer2Name.textContent = getPlayerName(2);
    }

    // No modo SOLO a CPU não usa teclado: esconde as dicas do Player 2
    if (player2KeyboardHints) {
        player2KeyboardHints.style.visibility =
            selectedMode === "SOLO" ? "hidden" : "visible";
    }

    // Posição inicial dos lutadores
    resetFighterPositions();

    // Carrega as spritesheets dos personagens
    loadFighterSprite(1);
    loadFighterSprite(2);

    // Atualiza as barras
    updateHealthBar(1);
    updateHealthBar(2);

    updatePowerBar(1);
    updatePowerBar(2);

    // Abre a tela de combate
    showPanel(combatPanel);

    startMovementLoop();

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

    resetFighterPositions();

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

    // A CPU também acumula energia durante a preparação
    startCpuTraining();

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

        // A luta começou: a CPU passa a atacar e checamos travamentos
        startCpuFight();
        checkFightStalemate();
    }, 1800);
}


/* =========================================================
   21. EXIBIÇÃO DOS DESAFIOS MATEMÁTICOS
   ========================================================= */




function displayMathChallenge(player, challenge, label = "PREPARAÇÃO") {
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
        // Mantém o selo "P1/P2" e troca só o texto do título
        const title = heading.lastElementChild || heading;
        title.textContent = `PLAYER ${player} - ${label}`;
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
    if (suddenDeath.active) {
        checkSuddenDeathAnswer(player);
        return;
    }

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

function executeAttack(player, attackName, fromCpu = false) {
    if (
        matchOver ||
        trainingActive ||
        roundFinished ||
        roundStarting ||
        suddenDeath.active
    ) {
        return;
    }

    // No modo SOLO o Player 2 só ataca quando a ação vem da CPU.
    if (player === 2 && selectedMode === "SOLO" && !fromCpu) {
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
        return;
    }

    // Se ninguém pode mais atacar, volta para a preparação.
    checkFightStalemate();
}

// Evita que a partida trave quando os dois jogadores ficam sem energia.
function checkFightStalemate() {
    if (
        matchOver ||
        trainingActive ||
        roundFinished ||
        roundStarting ||
        roundTransitionTimeout ||
        suddenDeath.active
    ) {
        return;
    }

    const cheapestAttack = attackTypes.leve.cost;

    if (
        playerPower[1] >= cheapestAttack ||
        playerPower[2] >= cheapestAttack
    ) {
        return;
    }

    if (combatStatus) {
        combatStatus.textContent =
            "AMBOS SEM ENERGIA! DESEMPATE...";
    }

    roundTransitionTimeout = setTimeout(() => {
        roundTransitionTimeout = null;

        if (matchOver || roundFinished) return;

        resolveEnergyTiebreak();
    }, 1500);
}

// Desempate quando os dois lutadores ficam sem energia:
//   1) vence quem tiver mais vida;
//   2) vida igual -> morte súbita (uma conta; quem acertar primeiro vence).
function resolveEnergyTiebreak() {
    const life1 = playerLife[1];
    const life2 = playerLife[2];

    if (life1 !== life2) {
        finishRound(
            life1 > life2 ? 1 : 2,
            "DESEMPATE POR VIDA"
        );
        return;
    }

    startSuddenDeath();
}

function startSuddenDeath() {
    if (matchOver || roundFinished) return;

    const challenge = generateMathQuestion(getQuestionDifficulty());
    challenge.training = false;

    suddenDeath = { active: true, challenge };

    if (combatStatus) {
        combatStatus.textContent =
            "MORTE SÚBITA! QUEM ACERTAR PRIMEIRO VENCE!";
    }

    if (combatTimer) {
        combatTimer.textContent = "SUDDEN DEATH";
    }

    // O Player 2 é exibido primeiro para o foco ficar no campo do Player 1
    if (selectedMode === "VERSUS LOCAL") {
        displayMathChallenge(2, challenge, "MORTE SÚBITA");
    }

    displayMathChallenge(1, challenge, "MORTE SÚBITA");

    // No SOLO a CPU também tenta responder, depois de um tempo
    if (selectedMode === "SOLO") {
        const delay =
            getCpuProfile().suddenDeathDelay +
            Math.random() * 2000;

        suddenDeathCpuTimeout = setTimeout(() => {
            suddenDeathCpuTimeout = null;

            if (suddenDeath.active) {
                endSuddenDeath(2);
            }
        }, delay);
    }
}

function checkSuddenDeathAnswer(player) {
    const challenge = suddenDeath.challenge;

    if (!suddenDeath.active || !challenge) return;

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
            feedback.textContent = "ERROU! TENTE DE NOVO!";
        }

        answerInput.value = "";
        answerInput.focus();
        return;
    }

    if (feedback) {
        feedback.textContent = "CORRETO!";
    }

    endSuddenDeath(player);
}

function endSuddenDeath(winner) {
    if (!suddenDeath.active) return;

    suddenDeath = { active: false, challenge: null };

    if (suddenDeathCpuTimeout) {
        clearTimeout(suddenDeathCpuTimeout);
        suddenDeathCpuTimeout = null;
    }

    hideMathChallenge(1);
    hideMathChallenge(2);

    finishRound(winner, "VENCEU NA MORTE SÚBITA");
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

    playAttackSprite(player, attackName);

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

function finishRound(winner, reason) {
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
            reason || `ROUND ${currentRound} FINALIZADO`;
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
   31. CONTROLES PELO TECLADO (iguais às dicas da tela)
   ========================================================= */

// PLAYER 1: A/D andar, W pular, F leve, G contra, H especial
// PLAYER 2: setas andar/pular, J leve, K contra, L especial

const attackKeys = {
    1: { f: "leve", g: "contra", h: "especial" },
    2: { j: "leve", k: "contra", l: "especial" }
};

const movementKeys = new Set([
    "a", "d", "w",
    "arrowleft", "arrowright", "arrowup"
]);

document.addEventListener("keydown", event => {
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

    // Evita que as setas rolem a página
    if (key.startsWith("arrow")) {
        event.preventDefault();
    }

    if (movementKeys.has(key)) {
        keysDown.add(key);
    }

    if (
        matchOver ||
        trainingActive ||
        roundFinished ||
        roundStarting ||
        event.repeat
    ) {
        return;
    }

    // PLAYER 1
    if (attackKeys[1][key]) {
        executeAttack(1, attackKeys[1][key]);
    }

    // PLAYER 2
    if (selectedMode === "VERSUS LOCAL" && attackKeys[2][key]) {
        executeAttack(2, attackKeys[2][key]);
    }
});

document.addEventListener("keyup", event => {
    keysDown.delete(event.key.toLowerCase());
});

window.addEventListener("blur", () => {
    keysDown.clear();
});


/* =========================================================
   31B. MOVIMENTO E PULO DOS LUTADORES
   ========================================================= */

const keysDown = new Set();

const fighterMotion = {
    1: { x: 0, y: 0, vy: 0 },
    2: { x: 0, y: 0, vy: 0 }
};

const movementControls = {
    1: { left: "a", right: "d", jump: "w" },
    2: { left: "arrowleft", right: "arrowright", jump: "arrowup" }
};

let movementFrameId = null;
let lastMovementTime = 0;

function resetFighterPositions() {
    keysDown.clear();

    [1, 2].forEach(player => {
        fighterMotion[player] = { x: 0, y: 0, vy: 0 };

        const container = player === 1
            ? fighterContainer1
            : fighterContainer2;

        if (container) {
            container.style.left = "0px";
            container.style.top = "0px";
        }
    });
}

function canFightersMove() {
    return (
        !matchOver &&
        !trainingActive &&
        !roundFinished &&
        !roundStarting &&
        !suddenDeath.active
    );
}

function startMovementLoop() {
    stopMovementLoop();

    lastMovementTime = performance.now();
    movementFrameId = requestAnimationFrame(movementLoop);
}

function stopMovementLoop() {
    if (movementFrameId) {
        cancelAnimationFrame(movementFrameId);
        movementFrameId = null;
    }
}

function movementLoop(timestamp) {
    // Para sozinho quando a tela de combate é fechada.
    if (
        !combatPanel ||
        combatPanel.classList.contains("hidden") ||
        !combatArena ||
        !fighterContainer1 ||
        !fighterContainer2
    ) {
        movementFrameId = null;
        return;
    }

    const dt = Math.min(0.05, (timestamp - lastMovementTime) / 1000);
    lastMovementTime = timestamp;

    const arenaRect = combatArena.getBoundingClientRect();
    const canMove = canFightersMove();

    const walkSpeed = arenaRect.width * 0.25;
    const jumpSpeed = arenaRect.height * 1.7;
    const gravity = arenaRect.height * 5.5;

    [1, 2].forEach(player => {
        const motion = fighterMotion[player];
        const container = player === 1
            ? fighterContainer1
            : fighterContainer2;

        const controls = movementControls[player];
        const isCpu = player === 2 && selectedMode === "SOLO";

        let direction = 0;

        if (canMove && !isCpu) {
            if (keysDown.has(controls.left)) direction -= 1;
            if (keysDown.has(controls.right)) direction += 1;

            if (
                keysDown.has(controls.jump) &&
                motion.y === 0 &&
                motion.vy === 0
            ) {
                motion.vy = jumpSpeed;
            }
        }

        // Caminhada com limites: bordas da arena e o outro lutador
        if (direction !== 0) {
            const rect1 = fighterContainer1.getBoundingClientRect();
            const rect2 = fighterContainer2.getBoundingClientRect();

            const gap = rect2.left - rect1.right;
            const minGap = -Math.min(rect1.width, rect2.width) * 0.2;
            const room = Math.max(0, gap - minGap);

            let dx = direction * walkSpeed * dt;

            if (player === 1) {
                dx = dx > 0
                    ? Math.min(dx, room)
                    : Math.max(dx, Math.min(0, arenaRect.left - rect1.left));
            } else {
                dx = dx < 0
                    ? Math.max(dx, -room)
                    : Math.min(dx, Math.max(0, arenaRect.right - rect2.right));
            }

            motion.x += dx;
        }

        // Pulo
        if (motion.y > 0 || motion.vy !== 0) {
            motion.y += motion.vy * dt;
            motion.vy -= gravity * dt;

            if (motion.y <= 0) {
                motion.y = 0;
                motion.vy = 0;
            }
        }

        container.style.left = `${motion.x}px`;
        container.style.top = `${-motion.y}px`;

        // Troca entre parado/andando sem interromper ataques e a entrada
        const state = fighterSpriteStates[player];
        const busy = ["entrada", "leve", "pesado", "contra", "especial"];

        if (state.image && !busy.includes(state.animation)) {
            const wanted = direction !== 0 ? "andar" : "parado";

            if (state.animation !== wanted) {
                setFighterAnimation(player, wanted);
            }
        }
    });

    movementFrameId = requestAnimationFrame(movementLoop);
}


/* =========================================================
   31C. CPU (MODO SOLO)
   ========================================================= */

const CPU_PROFILES = {
    iniciante: { trainEvery: 6000, trainChance: 0.6, attackEvery: 1800, suddenDeathDelay: 9000 },
    intermediario: { trainEvery: 5000, trainChance: 0.7, attackEvery: 1300, suddenDeathDelay: 6500 },
    avancado: { trainEvery: 4000, trainChance: 0.8, attackEvery: 900, suddenDeathDelay: 4500 }
};

function getCpuProfile() {
    return CPU_PROFILES[gameConfig?.difficulty] ||
        CPU_PROFILES.intermediario;
}

// Durante a preparação a CPU "acerta" contas de tempos em tempos.
function startCpuTraining() {
    if (selectedMode !== "SOLO") return;

    if (cpuTrainingInterval) {
        clearInterval(cpuTrainingInterval);
    }

    const profile = getCpuProfile();

    cpuTrainingInterval = setInterval(() => {
        if (!trainingActive || matchOver || roundFinished) return;
        if (Math.random() > profile.trainChance) return;

        addPower(
            2,
            getDifficultyReward(getQuestionDifficulty())
        );
    }, profile.trainEvery);
}

// Durante a luta a CPU escolhe o melhor ataque que consegue pagar.
function startCpuFight() {
    if (selectedMode !== "SOLO") return;
    if (matchOver || roundFinished) return;

    if (cpuFightInterval) {
        clearInterval(cpuFightInterval);
    }

    const profile = getCpuProfile();

    cpuFightInterval = setInterval(() => {
        if (
            matchOver ||
            trainingActive ||
            roundFinished ||
            roundStarting
        ) {
            return;
        }

        const power = playerPower[2];
        let attackName = null;

        if (power >= attackTypes.especial.cost && Math.random() < 0.6) {
            attackName = "especial";
        } else if (power >= attackTypes.contra.cost && Math.random() < 0.6) {
            attackName = "contra";
        } else if (power >= attackTypes.leve.cost) {
            attackName = "leve";
        }

        if (attackName) {
            executeAttack(2, attackName, true);
        }
    }, profile.attackEvery);
}



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

        stopFighterSprites();
        stopMovementLoop();
        keysDown.clear();

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
