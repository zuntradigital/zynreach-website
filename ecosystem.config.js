/**
 * PM2 process definition for production.
 *
 * This exists to close the deployment-process half of the intermittent
 * chunk-404 / "version skew" bug fixed alongside this file (see the large
 * doc comment on `deploymentId` in next.config.ts for the full mechanical
 * explanation). `deploymentId` makes any skew *detectable and recoverable*
 * client-side; this file's job — together with scripts/deploy.sh — is to
 * stop the skew from being created by this app's own process/deploy setup
 * in the first place:
 *
 *  - Every worker below runs `next start` against `__dirname` — i.e.
 *    whichever release directory this exact copy of the file happens to
 *    be sitting in. scripts/deploy.sh always finishes a full `next build`
 *    inside a brand-new, isolated release directory BEFORE it repoints
 *    the `current` symlink at it and tells PM2 to reload against
 *    `current/ecosystem.config.js` — so by the time any worker starts (or
 *    restarts) from this file, `__dirname` resolves to a release whose
 *    `.next` is already 100% complete. No worker is ever pointed at a
 *    directory `next build` is still writing into.
 *  - If this app is ever scaled to more than one worker (`instances`
 *    below), cluster-mode workers are forked copies of one Node process
 *    reading that one on-disk build, so they cannot disagree about a
 *    chunk's filename the way two independently-run `next build`
 *    invocations could (unless those invocations really are building
 *    different commits, which `deploymentId` covers).
 *  - `kill_timeout` gives an outgoing worker time to finish in-flight
 *    requests during a `pm2 reload` instead of being killed mid-response.
 *
 * Do not run `next build` from inside this same directory once a PM2
 * worker is reading from it live — that in-place rebuild-while-serving
 * race is the actual mechanism behind the original bug. Always deploy via
 * scripts/deploy.sh.
 */
const instances = Number(process.env.PM2_INSTANCES) || 1;

module.exports = {
  apps: [
    {
      name: "zynreach-website",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances,
      exec_mode: instances > 1 ? "cluster" : "fork",
      autorestart: true,
      max_memory_restart: "512M",
      listen_timeout: 10000,
      kill_timeout: 15000,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
