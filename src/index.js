// src/index.js
// Thin entry point — all logic lives in src/routes/, src/utils/, src/html/, etc.

import { routeRequest } from './router.js';
import { runAbandonmentCheck, runDailyHealthCheck } from './utils/internal.js';

export default {
  // Cron triggers:
  //   Every 2 hours — abandonment check
  //   Daily at 9am UTC — full system health check
  async scheduled(event, env, ctx) {
    ctx.waitUntil((async () => {
      try {
        await runAbandonmentCheck(env);
        if (event.cron === '0 9 * * *') {
          await runDailyHealthCheck(env);
        }
      } catch (e) {
        console.error('Scheduled task error:', e.message);
      }
    })());
  },

  async fetch(request, env, ctx) {
    return routeRequest(request, env, ctx);
  }
};
