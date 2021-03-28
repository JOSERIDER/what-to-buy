import { loadingController } from '@ionic/vue';

export default {
    setup() {
        async function createLoading(message: string, duration: number) {
           return  await loadingController
                .create({
                    cssClass: 'my-custom-class',
                    message,
                    duration,
                });
        }

        return {loading: createLoading}
    }
}