// تشغيل نغمة موسيقية قصيرة ولطيفة باستخدام متصفح الويب (Web Audio API)
export const playLikeSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sine'; // موجة ناعمة
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // نغمة D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // انتقال ناعم إلى A5

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  } catch (e) {
    console.log('Audio not supported or blocked');
  }
};