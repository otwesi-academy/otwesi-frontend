interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
}


const VideoModal = ({ isOpen, onClose }: VideoModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-999">
            <div className="relative w-[90%] max-w-3xl bg-black rounded-xl overflow-hidden shadow-xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-white text-2xl"
                >
                    ✕
                </button>

                <iframe
                    className="w-full h-[60vh]"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default VideoModal;
