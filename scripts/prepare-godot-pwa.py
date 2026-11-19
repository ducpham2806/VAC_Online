"""Prepare first-visit and update caching in the exported Godot Web preset."""
import sys
from pathlib import Path


WAIT_FOR_CONTROL = """function waitForVacPwaControl(engine, script) {
    if (!script || !('serviceWorker' in navigator)) return Promise.resolve();
    const sw = navigator.serviceWorker;
    const workerUrl = new URL(script, location.href).href;
    const controlsPage = () => sw.controller?.scriptURL === workerUrl;
    if (controlsPage()) return Promise.resolve();

    // Continue online if storage is blocked, or on browsers without a timely worker.
    return new Promise((resolve) => {
        const done = () => {
            clearTimeout(timeout);
            sw.removeEventListener('controllerchange', onControl);
            resolve();
        };
        const onControl = () => { if (controlsPage()) done(); };
        const timeout = setTimeout(done, 4000);
        sw.addEventListener('controllerchange', onControl);
        engine.installServiceWorker().then(onControl, done);
    });
}

"""

INSTALL_CACHE = """self.addEventListener('install', (event) => {
	// An update can activate while offline once the old window closes.
	const files = self.registration.active
		? FULL_CACHE.map((file) => new Request(file, { cache: 'reload' }))
		: CACHED_FILES;
	event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(files)));
});"""


def replace_once(source, old, new):
    if source.count(old) != 1:
        raise SystemExit(f"Không nhận ra mẫu Web/PWA Godot: {old!r}")
    return source.replace(old, new, 1)


def main(folder):
    page = folder / "index.html"
    worker = folder / "index.service.worker.js"
    html = page.read_text(encoding="utf-8")
    sw = worker.read_text(encoding="utf-8")
    marker = "const engine = new Engine(GODOT_CONFIG);"
    html = replace_once(html, marker, WAIT_FOR_CONTROL + marker)
    html = replace_once(
        html,
        "engine.startGame({",
        "waitForVacPwaControl(engine, GODOT_CONFIG.serviceWorker)\n\t\t\t.then(() => engine.startGame({",
    )
    html = replace_once(
        html, "\t\t}).then(() => {\n\t\t\tsetStatusMode('hidden');",
        "\t\t})).then(() => {\n\t\t\tsetStatusMode('hidden');",
    )

    sw = replace_once(
        sw,
        "self.addEventListener('install', (event) => {\n"
        "\tevent.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHED_FILES)));\n"
        "});",
        INSTALL_CACHE,
    )
    # First activation controls the loading page. Updates still wait for old pages to close.
    sw = replace_once(
        sw,
        "self.registration.navigationPreload.enable() : Promise.resolve();\n\t}));",
        "self.registration.navigationPreload.enable() : Promise.resolve();\n"
        "\t}).then(() => self.clients.claim()));",
    )
    # Keep the worker alive for the cache write, while the response still streams to Godot.
    sw = replace_once(
        sw, "if (isCacheable) {\n\t\t// And update the cache\n\t\tcache.put(event.request, response.clone());",
        "if (isCacheable && response.ok) {\n"
        "\t\tevent.waitUntil(cache.put(event.request, response.clone()).catch(() => {}));",
    )
    page.write_text(html, encoding="utf-8")
    worker.write_text(sw, encoding="utf-8")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
