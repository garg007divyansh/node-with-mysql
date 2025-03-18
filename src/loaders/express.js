import cors from "cors";
import { prefix } from '../config/index.js';
import bodyParser from 'body-parser';
import routes from '../routes/v1/index.js';

export default (app) => {
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(prefix, routes);

  // app.get('/', (_req, res) => {
  //   return res.status(200).json({
  //     resultMessage: {
  //       en: 'Project is successfully working...',
  //       tr: 'Proje başarılı bir şekilde çalışıyor...'
  //     },
  //     resultCode: '00004'
  //   }).end();
  // });
}