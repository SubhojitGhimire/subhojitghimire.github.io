document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('main-container');
    const contentArea = document.getElementById('content-area');
    const linkButtons = document.querySelectorAll('.link-button');
    const closePanelBtn = document.getElementById('close-panel-btn');

    const GITHUB_USERNAME = 'SubhojitGhimire';
    const RESUME_PATH = './assets/files/href-resume_subhojit_ghimire.pdf';
    const LINKEDIN_EMBED_URL = 'https://www.linkedin.com/embed/in/subhojitghimire';
    const LINKEDIN_USERNAME = 'subhojitghimire';

    const cursorDot = document.getElementById('cursor-dot');
    const colors = ['#FFFFFF', '#FFD700', '#ADD8E6', '#90EE90'];
    document.addEventListener('mousemove', e => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;

        const star = document.createElement('div');
        star.className = 'star';

        star.style.left = `${e.clientX + Math.random() * 10 - 5}px`;
        star.style.top = `${e.clientY + Math.random() * 10 - 5}px`;

        const size = Math.random() * 4 + 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        document.body.appendChild(star);

        setTimeout(() => {
            star.remove();
        }, 700);
    });

    const openPanel = (contentType) => {
        contentArea.innerHTML = '';
        linkButtons.forEach(btn => btn.classList.remove('active'));
        mainContainer.classList.add('active');
        closePanelBtn.style.display = 'block';
        switch (contentType) {
            case 'resume': loadResume(); break;
            case 'linkedin': loadLinkedIn(); break;
            case 'github': loadGithubRepos(); break;
        }

    };

    const closePanel = () => {
        mainContainer.classList.remove('active');
        contentArea.innerHTML = '';
        closePanelBtn.style.display = 'none';
    };

    const loadResume = () => {
        contentArea.innerHTML = `<h2 class="text-2xl font-bold text-white mb-4">Résumé</h2><iframe src="${RESUME_PATH}" class="w-full h-full rounded-lg" style="height: calc(100vh - 6rem);"></iframe>`;
    };

    const loadLinkedIn = () => {
        contentArea.innerHTML = `<h2 class="text-2xl font-bold text-white mb-4">LinkedIn</h2><div class="bg-gray-800 p-4 rounded-lg text-center"><p class="mb-4">LinkedIn often blocks direct embedding. If the profile doesn't load, please use the direct link below.</p><a href="https://linkedin.com/in/${LINKEDIN_USERNAME}" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Profile on LinkedIn</a></div><iframe src="${LINKEDIN_EMBED_URL}" class="w-full h-full rounded-lg mt-4" style="height: calc(100vh - 12rem);"></iframe>`;
    };

    const loadGithubRepos = async () => {
        contentArea.innerHTML = `<div class="text-center text-gray-400">Loading GitHub repositories...</div>`;
        try {
            const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc`);
            if (!response.ok) throw new Error(`GitHub API error: ${response.statusText}`);
            const repos = await response.json();
            let reposHtml = `<h2 class="text-2xl font-bold text-white mb-4">GitHub Repositories</h2><div class="space-y-4">`;
            repos.forEach(repo => {
                reposHtml += `
                    <div class="p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <div class="flex justify-between items-start">
                            <div>
                                <a href="${repo.html_url}" target="_blank" class="text-lg font-semibold text-blue-400 hover:underline">${repo.name}</a>
                                <p class="text-gray-400 mt-1 text-sm">${repo.description || 'No description available.'}</p>
                            </div>
                            <button class="summarize-btn" data-repo-name="${repo.name}">✨ Summarize</button>
                        </div>
                        <div class="flex items-center text-xs text-gray-500 mt-3">
                            <span class="mr-4"><i class="fas fa-star mr-1"></i> ${repo.stargazers_count}</span>
                            <span class="mr-4"><i class="fas fa-code-branch mr-1"></i> ${repo.forks_count}</span>
                            ${repo.language ? `<span><i class="fas fa-circle mr-1"></i> ${repo.language}</span>` : ''}
                        </div>
                        <div class="summary-container" id="summary-${repo.name}" style="display: none;"></div>
                    </div>`;
            });
            reposHtml += `</div>`;
            contentArea.innerHTML = reposHtml;
        } catch (error) {
            console.error('Failed to fetch GitHub repos:', error);
            contentArea.innerHTML = `<div class="text-center text-red-400">Failed to load repositories. Please try again later.</div>`;
        }
    };

    // The following section is summarizeReadme function that uses plain text Gemini API without encryption or secure server. NOT SAFE to expose API Key when hosted publicly on GitHub
    // const summarizeReadme = async (repoName, button) => {
    //     const summaryContainer = document.getElementById(`summary-${repoName}`);
    //     summaryContainer.style.display = 'block';
    //     summaryContainer.innerHTML = '<div class="flex items-center"><div class="loader"></div><span>Summarizing with Gemini...</span></div>';
    //     button.disabled = true;

    //     try {
    //         const readmeResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/readme`);
    //         if (!readmeResponse.ok) {
    //             throw new Error('README not found or API limit reached.');
    //         }
    //         const readmeData = await readmeResponse.json();
    //         const readmeContent = atob(readmeData.content);

    //         const prompt = `Summarize the following README.md for a software project in 2-3 concise sentences. Focus on the project's main goal and the technologies used. README content:\n\n---\n${readmeContent}`;

    //         const payload = {
    //             contents: [{ role: "user", parts: [{ text: prompt }] }]
    //         };
    //         const apiKey = "";
    //         const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    //         if (!apiKey) {
    //             summaryContainer.innerHTML = '<span class="text-yellow-400">Gemini API key is missing. Add your API key in main.js to enable summarization.</span>';
    //             return;
    //         }

    //         const geminiResponse = await fetch(apiUrl, {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(payload)
    //         });

    //         if (!geminiResponse.ok) {
    //                 const errorBody = await geminiResponse.text();
    //                 throw new Error(`Gemini API Error: ${geminiResponse.status} ${errorBody}`);
    //         }

    //         const result = await geminiResponse.json();

    //         if (result.candidates && result.candidates.length > 0) {
    //             const summaryText = result.candidates[0].content.parts[0].text;
    //             summaryContainer.innerHTML = summaryText.replace(/\n/g, '<br>');
    //         } else {
    //             throw new Error('No summary returned from Gemini.');
    //         }

    //     } catch (error) {
    //         console.error('Summarization failed:', error);
    //         summaryContainer.innerHTML = `<span class="text-red-400">Could not generate summary. ${error.message}</span>`;
    //     } finally {
    //         button.disabled = false;
    //     }
    // };


    // The following section is the updated summarizeReadme function that uses a secure proxy -> Cloudflare Workers
    const summarizeReadme = async (repoName, button) => {
        const summaryContainer = document.getElementById(`summary-${repoName}`);
        summaryContainer.style.display = 'block';
        summaryContainer.innerHTML = '<div class="flex items-center"><div class="loader"></div><span>Summarizing with Gemini...</span></div>';
        button.disabled = true;

        const workerUrl = 'https://portfolio-gemini-proxy.subhojitg.workers.dev';

        try {
            const readmeResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/readme`);
            if (!readmeResponse.ok) {
                throw new Error('README not found or GitHub API limit reached.');
            }
            const readmeData = await readmeResponse.json();

            const readmeContentBase64 = readmeData.content;

            const workerResponse = await fetch(workerUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ readmeContentBase64: readmeContentBase64 })
            });

            if (!workerResponse.ok) {
                const errorResult = await workerResponse.json();
                throw new Error(errorResult.error || 'Failed to get summary from worker.');
            }

            const result = await workerResponse.json();

            if (result.candidates && result.candidates.length > 0) {
                const summaryText = result.candidates[0].content.parts[0].text;
                summaryContainer.innerHTML = summaryText.replace(/\n/g, '<br>');
            } else {
                throw new Error('No summary returned from Gemini.');
            }

        } catch (error) {
            console.error('Summarization failed:', error);
            summaryContainer.innerHTML = `<span class="text-red-400">Could not generate summary. ${error.message}</span>`;
        } finally {
            button.disabled = false;
        }
    };

    document.body.addEventListener('click', (e) => {
        const linkButton = e.target.closest('.link-button');
        if (linkButton) {
            const contentType = linkButton.getAttribute('data-content');
            openPanel(contentType);
            return;
        }

        if (e.target.closest('#close-panel-btn')) {
            closePanel();
            return;
        }

        const summarizeButton = e.target.closest('.summarize-btn');
        if (summarizeButton) {
            const repoName = summarizeButton.getAttribute('data-repo-name');
            summarizeReadme(repoName, summarizeButton);
            return;
        }
    });
});

fetch('./assets/images/4AAQSkZJRgABAQEBLAEsAAD.txt')
    .then(response => response.text())
    .then(base64Data => {
        const imgElement = document.getElementById('profile-image');
        imgElement.src = 'data:image/jpeg;base64,' + base64Data;
    })
    .catch(error => {
        console.error('Error loading Base64 image:', error);

    });

