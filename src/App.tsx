import { motion, AnimatePresence } from 'motion/react';
import { useSnakeGame } from './hooks/useSnakeGame';
import { useMusicPlayer } from './hooks/useMusicPlayer';

export default function App() {
  const {
    snake, food, score, isGameOver, isPaused, resetGame, togglePause, GRID_SIZE,
  } = useSnakeGame();

  const {
    currentTrack, isPlaying, progress, togglePlay, nextTrack, prevTrack, tracks,
  } = useMusicPlayer();

  return (
    <div className="h-screen w-full bg-black text-white font-digital p-4 md:p-8 overflow-hidden flex flex-col relative uppercase">
      <div className="static-noise"></div>
      
      {/* Header */}
      <header className="w-full flex justify-between items-end mb-8 screen-tear">
        <h1 className="glitch-text text-3xl md:text-5xl font-pixel text-cyan" data-text="SYS.OP_TERMINAL">SYS.OP_TERMINAL</h1>
        <div className="text-magenta text-3xl">V.1.0.0_ERR</div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full w-full max-w-7xl mx-auto relative z-10">
        
        {/* Left: Audio Stream */}
        <div className="lg:col-span-3 brutal-box p-4 flex flex-col">
          <h3 className="font-pixel text-[10px] text-magenta mb-4">&gt;&gt; AUDIO.STREAM_BUFFER</h3>
          <div className="space-y-4 overflow-y-auto flex-1 custom-scrollbar">
            {tracks.map((track) => (
              <div 
                key={track.id}
                onClick={() => { if (track.id !== currentTrack.id) nextTrack(); }}
                className={`p-3 border-4 cursor-pointer transition-none ${
                  track.id === currentTrack.id 
                    ? 'border-cyan bg-cyan text-black' 
                    : 'border-white/20 hover:border-magenta hover:text-magenta'
                }`}
              >
                <div className="text-3xl font-bold truncate">
                  {track.id === currentTrack.id ? '> ' : ''}{track.title}
                </div>
                <div className="text-2xl opacity-80 truncate">{track.artist}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Snake Entity */}
        <div className="lg:col-span-6 brutal-box-alt p-4 flex flex-col items-center justify-center relative">
          <h3 className="absolute top-4 left-4 font-pixel text-[10px] text-cyan">&gt;&gt; ENTITY.SNAKE_DATA</h3>
          
          <div 
            className="w-full max-w-[400px] aspect-square grid border-4 border-magenta relative mt-8 bg-black"
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
            }}
          >
            {/* Grid Lines */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" 
              style={{ 
                backgroundImage: 'linear-gradient(to right, #00ffff 1px, transparent 1px), linear-gradient(to bottom, #00ffff 1px, transparent 1px)',
                backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
              }} 
            />

            {/* Snake */}
            {snake.map((segment, i) => (
              <div
                key={`${segment.x}-${segment.y}-${i}`}
                className={`${i === 0 ? 'bg-cyan' : 'bg-cyan/70'} border border-black`}
                style={{
                  gridColumnStart: segment.x + 1,
                  gridRowStart: segment.y + 1,
                }}
              />
            ))}

            {/* Food */}
            <div
              className="bg-magenta border border-black animate-pulse"
              style={{
                gridColumnStart: food.x + 1,
                gridRowStart: food.y + 1,
              }}
            />

            {/* Game Over Overlay */}
            <AnimatePresence>
              {isGameOver && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-4 border-magenta"
                >
                  <h2 className="glitch-text text-2xl md:text-3xl font-pixel text-magenta mb-4 text-center" data-text="FATAL_ERROR">FATAL_ERROR</h2>
                  <p className="text-4xl text-cyan mb-8">SCORE: {score}</p>
                  <button 
                    onClick={resetGame}
                    className="px-6 py-2 border-4 border-cyan text-cyan text-3xl hover:bg-cyan hover:text-black uppercase"
                  >
                    [ REBOOT_SEQUENCE ]
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pause Overlay */}
            <AnimatePresence>
              {isPaused && !isGameOver && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 border-4 border-cyan"
                >
                  <button 
                    onClick={togglePause}
                    className="px-6 py-2 border-4 border-magenta text-magenta text-3xl hover:bg-magenta hover:text-black uppercase"
                  >
                    [ RESUME_EXECUTION ]
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="mt-6 flex justify-between w-full max-w-[400px] text-3xl text-magenta">
            <div>[WASD/ARROWS]: MOVE</div>
            <div>[SPACE]: HALT</div>
          </div>
        </div>

        {/* Right: Controls & Stats */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          
          {/* Stats */}
          <div className="brutal-box p-4">
            <h3 className="font-pixel text-[10px] text-magenta mb-4">&gt;&gt; SYS.METRICS</h3>
            <div className="flex flex-col gap-4">
              <div className="border-4 border-cyan p-2">
                <div className="text-2xl text-white/70">SCORE_VAL</div>
                <div className="text-6xl text-cyan font-bold">{score.toString().padStart(4, '0')}</div>
              </div>
              <div className="border-4 border-magenta p-2">
                <div className="text-2xl text-white/70">PEAK_VAL</div>
                <div className="text-6xl text-magenta font-bold">0000</div>
              </div>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="brutal-box-alt p-4 flex-1 flex flex-col">
            <h3 className="font-pixel text-[10px] text-cyan mb-4">&gt;&gt; CTRL.AUDIO_OVERRIDE</h3>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-4xl text-magenta mb-2 truncate">{currentTrack.title}</div>
              <div className="text-2xl text-cyan mb-8 truncate">{currentTrack.artist}</div>
              
              <div className="flex justify-between items-center mb-8">
                <button onClick={prevTrack} className="text-4xl hover:text-cyan">[ &lt;&lt; ]</button>
                <button 
                  onClick={togglePlay} 
                  className="text-5xl text-magenta hover:text-white"
                >
                  {isPlaying ? '[ || ]' : '[ &gt; ]'}
                </button>
                <button onClick={nextTrack} className="text-4xl hover:text-cyan">[ &gt;&gt; ]</button>
              </div>

              <div className="w-full border-4 border-white/30 h-8 relative">
                <div 
                  className="h-full bg-cyan"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-2xl text-white/50">
                <span>00:00</span>
                <span>00:00</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

