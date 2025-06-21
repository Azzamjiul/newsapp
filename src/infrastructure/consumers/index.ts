import { sequelize } from '../../config';
import { startNewsUrlsConsumer } from './newsUrls.consumer';

(async () => {
  await sequelize.sync();
  await startNewsUrlsConsumer();
})();
