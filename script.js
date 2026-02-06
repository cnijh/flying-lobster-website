// Copy install command to clipboard
function copyInstallCommand() {
    const command = 'npx flying-lobster install';
    const copyBtn = document.getElementById('copy-btn');
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(command).then(() => {
            showCopyFeedback();
        }).catch(() => {
            fallbackCopyToClipboard(command);
        });
    } else {
        fallbackCopyToClipboard(command);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showCopyFeedback();
    } catch (err) {}
    document.body.removeChild(textArea);
}

function showCopyFeedback() {
    const copyText = document.getElementById('copy-text');
    const copySuccess = document.getElementById('copy-success');
    const copyBtn = document.getElementById('copy-btn');
    
    copyText.style.display = 'none';
    copySuccess.style.display = 'inline';
    copyBtn.classList.add('copied');
    
    setTimeout(() => {
        copyText.style.display = 'inline';
        copySuccess.style.display = 'none';
        copyBtn.classList.remove('copied');
    }, 2000);
}

// Animate count up
function animateCount(element, target, duration = 1500) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Fetch npm download count
async function fetchDownloadCount() {
    try {
        const res = await fetch('https://api.npmjs.org/downloads/point/last-month/flying-lobster');
        const data = await res.json();
        const count = data.downloads;
        const el = document.getElementById('download-count');
        // Animate count up after a short delay
        setTimeout(() => animateCount(el, count), 500);
    } catch (e) {
        document.getElementById('download-count').textContent = '700+';
    }
}

// Demo animations
function initDemo() {
    const demoWindow = document.getElementById('demo-window');
    const demoBg = document.getElementById('demo-bg');
    const demoShortcut = document.getElementById('demo-shortcut');
    
    if (!demoWindow) return;
    
    const scenes = [
        {
            keys: ['⌘', '⇧', 'L'],
            label: 'Summon your agent',
            action: () => {
                demoBg.src = 'screenshots/bg1.png';
                demoBg.classList.add('cropped');
                demoWindow.src = 'screenshots/rooty.png';
                demoWindow.classList.remove('hidden', 'slide-in', 'switching');
            }
        },
        {
            keys: ['⌘', '⇧', 'L'],
            label: 'Even on fullscreen apps',
            action: () => {
                demoBg.src = 'screenshots/bg2.png';
                demoBg.classList.remove('cropped');
            }
        },
        {
            keys: ['⌘', '⇧', '→'],
            label: 'Switch agents instantly',
            action: () => {
                demoWindow.src = 'screenshots/atlas - dark.png';
                demoWindow.classList.remove('switching');
                demoWindow.classList.add('slide-in');
            }
        },
        {
            keys: ['⌘', '⇧', 'K'],
            label: 'Toggle theme',
            action: () => {
                demoWindow.classList.remove('slide-in');
                demoWindow.classList.add('switching');
                setTimeout(() => {
                    demoWindow.src = 'screenshots/atlas - light.png';
                }, 150);
                setTimeout(() => {
                    demoWindow.classList.remove('switching');
                }, 300);
            }
        }
    ];
    
    let currentScene = -1;
    
    function runScene(index) {
        const scene = scenes[index];
        if (!scene) return;
        
        demoShortcut.classList.remove('show');
        
        setTimeout(() => {
            const keysHtml = scene.keys.map(k => `<kbd>${k}</kbd>`).join('');
            demoShortcut.querySelector('.shortcut-keys').innerHTML = keysHtml;
            demoShortcut.querySelector('.shortcut-label').textContent = scene.label;
            demoShortcut.classList.add('show');
            scene.action();
        }, 200);
    }
    
    function nextScene() {
        currentScene = (currentScene + 1) % scenes.length;
        
        if (currentScene === 0) {
            demoWindow.classList.add('hidden');
            demoShortcut.classList.remove('show');
            setTimeout(() => runScene(currentScene), 300);
        } else {
            runScene(currentScene);
        }
    }
    
    demoWindow.classList.add('hidden');
    setTimeout(nextScene, 500);
    setInterval(nextScene, 2500);
}

document.addEventListener('DOMContentLoaded', function() {
    initDemo();
    fetchDownloadCount();
});
