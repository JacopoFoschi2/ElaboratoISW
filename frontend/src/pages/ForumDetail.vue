<script setup>
import { ref, onMounted } from 'vue';

const getImageUrl = (game) => {
    try {
        if (game.gameBigBannerBin && game.gameBigBannerBin.data) {
            const arrayBuffer = new Uint8Array(game.gameBigBannerBin.data);
            let binary = '';
            const bytes = new Uint8Array(arrayBuffer);
            const len = bytes.byteLength;

            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return `data:image/jpg;base64,${window.btoa(binary)}`;
        }
    }
    catch (error) {
        console.error('Error processing image:', error);
    }
    return '';
};

</script>