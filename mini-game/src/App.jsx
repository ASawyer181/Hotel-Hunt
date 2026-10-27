import { useState, useEffect, useRef } from 'react'
import hotelLayout from './assets/hotelLayout.jpg'
import userImg from './assets/user.png'
import coinImg from './assets/coin.png' 
import './App.css'

const MAP_WIDTH = 1024;
const MAP_HEIGHT = 576;
const SPRITE_SIZE = 45;
const HOTEL_BOUNDS = { left: 0.13, right: 0.87, top: 0.08, bottom: 0.88 };
const WALKABLE_ZONES = [
    { left: 90 / MAP_WIDTH, right: 860 / MAP_WIDTH, top: 180 / MAP_HEIGHT, bottom: 290 / MAP_HEIGHT },
    { left: 40 / MAP_WIDTH, right: 200 / MAP_WIDTH, top: 90 / MAP_HEIGHT, bottom: 380 / MAP_HEIGHT }
];

const getWalkableAreas = (width, height) => {
    const hotelBounds = {
        left: HOTEL_BOUNDS.left + SPRITE_SIZE / (2 * width),
        right: HOTEL_BOUNDS.right - SPRITE_SIZE / (2 * width),
        top: HOTEL_BOUNDS.top + SPRITE_SIZE / (2 * height),
        bottom: HOTEL_BOUNDS.bottom - SPRITE_SIZE / (2 * height)
    };

    return WALKABLE_ZONES.map((zone) => ({
        left: Math.max(zone.left, hotelBounds.left),
        right: Math.min(zone.right, hotelBounds.right),
        top: Math.max(zone.top, hotelBounds.top),
        bottom: Math.min(zone.bottom, hotelBounds.bottom)
    })).filter((area) => area.left < area.right && area.top < area.bottom);
};

const isInsideWalkableZone = (x, y, width, height) =>
    getWalkableAreas(width, height).some((area) =>
        x >= area.left && x <= area.right && y >= area.top && y <= area.bottom
    );

const getRandomWalkablePosition = (width, height) => {
    const areas = getWalkableAreas(width, height);
    if (areas.length === 0) return null;

    const area = areas[Math.floor(Math.random() * areas.length)];
    return {
        x: area.left + Math.random() * (area.right - area.left),
        y: area.top + Math.random() * (area.bottom - area.top)
    };
};

function App() {
    const [balance, setBalance] = useState(0);
    const [playerPos, setPlayerPos] = useState({ x: 690 / MAP_WIDTH, y: 230 / MAP_HEIGHT });
    const [coin, setCoin] = useState(null);
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [level, setPlayerLevel] = useState(1);
    const [nums, setNums] = useState(10);
    const mapImageRef = useRef(null);
    
    // Timer state for the quiz countdown
    const [timeLeft, setTimeLeft] = useState(0);

    // --- COIN SPAWNING TIMER ---
    useEffect(() => {
        const coinTime = setInterval(() => {
            if (!coin && !activeQuiz){
                const mapImage = mapImageRef.current;
                if (!mapImage) return;

                const { width, height } = mapImage.getBoundingClientRect();
                const position = getRandomWalkablePosition(width, height);
                if (position) setCoin(position);
            }
        }, 15000);
        return () => clearInterval(coinTime); 
    }, [coin, activeQuiz]);

    // --- FIXED: QUIZ TIMER EFFECT RUNS EVERY 1 SECOND NOW ---
    useEffect(() => {
        if (!activeQuiz) return;
        if (timeLeft === 0) {
            alert("Time's up! The puzzle locked.");
            setActiveQuiz(null);
            return;
        }

        const countdown = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000); // FIXED: Changed from 10000ms to 1000ms (Exactly 1 Second)

        return () => clearTimeout(countdown);
    }, [timeLeft, activeQuiz]);

    // --- PROXIMITY DETECTION ---
    useEffect(() => {
        if(coin){
            const mapImage = mapImageRef.current;
            if (!mapImage) return;

            const { width, height } = mapImage.getBoundingClientRect();
            const distance = Math.sqrt(
                Math.pow((playerPos.x - coin.x) * width, 2) +
                Math.pow((playerPos.y - coin.y) * height, 2)
            );
            if (distance < 40) {
                const randomNum1 = Math.floor(Math.random() * nums) + 1;
                const randomNum2 = Math.floor(Math.random() * nums) + 1;
                
                const mathPool = [
                    { q: `${randomNum1} * ${randomNum2}`, a: (randomNum1 * randomNum2).toString() },
                    { q: `${randomNum1} + ${randomNum2}`, a: (randomNum1 + randomNum2).toString() }
                ];
                
                const randomQ = mathPool[Math.floor(Math.random() * mathPool.length)];
                
                setActiveQuiz(randomQ);
                setTimeLeft(15); 
                setCoin(null);
            }
        }
    }, [playerPos, coin, nums]);

    // --- WALKING ---
    const handleMapClick = (e) => {
        if(activeQuiz) return;
        const mapImage = mapImageRef.current;
        if (!mapImage) return;

        const rect = mapImage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        if (isInsideWalkableZone(x, y, rect.width, rect.height)) {
            setPlayerPos({ x, y });
        }
    };

    // --- ANSWER CHECKER ---
    const submitAnswer = (userInput) => {
        if (userInput.trim() === activeQuiz.a) {
            alert("Correct! + 10 Coins!");
            const newBalance = balance + 10;
            setBalance(newBalance);
            
            if (newBalance / level === 10) {
                setPlayerLevel(level + 1);
                setNums(nums + 10); 
            }
        } else {
            alert(`Oops the correct answer was: ${activeQuiz.a}`); 
        }
        setActiveQuiz(null);
    };

    return (
        <section id="center">
            <div className="balance-badge">
                💰 Balance: <span>{balance}</span> | Lvl: <span>{level}</span>
            </div>
            <div className="hotel" onClick={handleMapClick} style={{ position: 'relative', cursor: 'pointer' }}>
                <img ref={mapImageRef} src={hotelLayout} className="base" alt="Hotel Layout" />
                
                <div 
                    className="game-player"
                    style={{ left: `${playerPos.x * 100}%`, top: `${playerPos.y * 100}%` }}
                >
                    <img src={userImg} className="sprite-img" alt="Player character" />
                </div>
                
                {coin && (
                    <div
                        className="game-coin"
                        style={{ left: `${coin.x * 100}%`, top: `${coin.y * 100}%` }}
                    >
                        <img src={coinImg} className="sprite-img" alt="Target Coin" />
                    </div>
                )}
            </div>

            {activeQuiz && (
                <div className="quiz-modal">
                    <div className="quiz-content">
                        <h3>🔒 Puzzle Lockbox</h3>
                        <p className="timer-text">⏳ Time Left: {timeLeft}s</p>
                        <p>Solve: {activeQuiz.q}</p>
                        <input type="text" id="player-reply" placeholder="Type your answer..." autoComplete="off" />
                        <button onClick={() => submitAnswer(document.getElementById('player-reply').value)}>
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default App;
