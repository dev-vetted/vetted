import { t } from '../t';
import { petRouter } from './pet';

export const rootRouter = t.router({
  pet: petRouter,
});

export type RootRouter = typeof rootRouter;


