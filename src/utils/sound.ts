// utils/sound.ts
export class SoundManager {
    private static instance: SoundManager;
    private audio: HTMLAudioElement;

    private constructor() {
        this.audio = new Audio(chrome.runtime.getURL( '../../../assets/notification.mp3'));
    }

    public static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    public playNotification() {
        this.audio.currentTime = 0; // Reset the audio to start
        this.audio.play().catch(error => {
            console.warn('Failed to play notification sound:', error);
        });
    }
}