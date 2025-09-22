document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update CTA button to scroll to about section
    document.querySelector('.cta').addEventListener('click', function() {
        document.querySelector('#about').scrollIntoView({
            behavior: 'smooth'
        });
    });

    // Advanced Intersection Observer for fade-in animations on sections
    const sectionObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, sectionObserverOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });

    // Stagger animation for .stagger-item elements (videos and articles)
    const staggerObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const staggerObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // Stagger delay 100ms per item
                observer.unobserve(entry.target);
            }
        });
    }, staggerObserverOptions);

    // Observe stagger items
    document.querySelectorAll('.stagger-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        staggerObserver.observe(item);
    });

    // Fallback for stagger items to show on load if observer doesn't trigger (e.g., short page)
    setTimeout(() => {
        document.querySelectorAll('.stagger-item').forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 500);

    // Mobile menu toggle
    window.toggleMobileMenu = function() {
        const navUl = document.querySelector('nav ul');
        navUl.classList.toggle('mobile-open');
    };

    // Close mobile menu on resize to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            const navUl = document.querySelector('nav ul');
            navUl.classList.remove('mobile-open');
        }
    });

    // Form handling with improved feedback
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            console.log('Form submitted:', data);
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.textContent = 'جاري الإرسال...';

            if (this.closest('#join')) {
                // Join form: Open mailto with pre-filled email
                const subject = encodeURIComponent('طلب انضمام إلى أنت صاحب المنصة');
                const body = encodeURIComponent(`الاسم: ${data.name || ''}\nالبريد الإلكتروني: ${data.email || ''}\nنوع المشاركة: ${data['type'] || ''}\n\nمرحباً، أنا أرغب في الانضمام إلى المنصة.`);
                const mailtoUrl = `mailto:alsadaghamid@gmail.com?subject=${subject}&body=${body}`;
                window.location.href = mailtoUrl;
                setTimeout(() => {
                    alert('أهلاً بك! أنت صاحب المنصة، ونحن نهتم بكل من ينضم إلينا. تم توجيه طلبك إلى فريقنا، وسنرد عليك قريبًا لنبدأ رحلتك معنا في التمكين والقيادة.');
                    this.reset();
                    submitBtn.textContent = 'إرسال';
                }, 1000);
            } else {
                // Other forms (e.g., contact): Open mailto with pre-filled email
                const subject = encodeURIComponent('رسالة من موقع أنت صاحب المنصة');
                const body = encodeURIComponent(`الاسم: ${data.name || ''}\nالبريد الإلكتروني: ${data.email || ''}\nرابط الموقع: ${data.url || ''}\nالرسالة: ${data.message || ''}\n\nمرحباً، هذه رسالة من الزائر.`);
                const mailtoUrl = `mailto:alsadaghamid@gmail.com?subject=${subject}&body=${body}`;
                window.location.href = mailtoUrl;
                setTimeout(() => {
                    alert('تم إرسال الرسالة بنجاح! سنرد عليك قريبًا.');
                    this.reset();
                    submitBtn.textContent = 'إرسال';
                }, 1000);
            }
        });
    });

    // Category filter for videos with animation
    const allVideos = document.querySelectorAll('.video-gallery iframe');
    document.querySelectorAll('.categories button').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            allVideos.forEach((video, index) => {
                if (category === 'الكل' || video.dataset.category === category) {
                    video.style.display = 'block';
                    setTimeout(() => {
                        video.style.opacity = '1';
                        video.style.transform = 'translateY(0)';
                    }, index * 50);
                } else {
                    video.style.opacity = '0';
                    video.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        video.style.display = 'none';
                    }, 300);
                }
            });
            // Highlight active button with animation
            document.querySelectorAll('.categories button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Set initial active button
    document.querySelector('.categories button[data-category="الكل"]').classList.add('active');

    // Search and filter for articles with real-time update
    const searchInput = document.querySelector('.search-filter input');
    const topicSelect = document.querySelector('.search-filter select');
    const articles = document.querySelectorAll('.articles article');

    function filterArticles() {
        const query = searchInput.value.toLowerCase();
        const topic = topicSelect.value;

        articles.forEach((article, index) => {
            const text = article.textContent.toLowerCase();
            const matchesSearch = !query || text.includes(query);
            const matchesTopic = !topic || article.dataset.topic === topic;
            if (matchesSearch && matchesTopic) {
                article.style.display = 'block';
                setTimeout(() => {
                    article.style.opacity = '1';
                    article.style.transform = 'translateY(0)';
                }, index * 100);
            } else {
                article.style.opacity = '0';
                article.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    article.style.display = 'none';
                }, 300);
            }
        });
    }

    if (searchInput && topicSelect) {
        searchInput.addEventListener('input', filterArticles);
        topicSelect.addEventListener('change', filterArticles);
    }

    // Lazy loading confirmation and performance
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        console.log('Lazy loading supported natively');
    } else {
        // Fallback for older browsers (polyfill if needed)
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (img.complete) {
                img.src = img.dataset.src || img.src;
            }
        });
    }
    // Flat Editor functionality
    if (document.getElementById('flat-editor')) {
        const errorDiv = document.getElementById('error-message');

        function showError(msg) {
            errorDiv.textContent = msg;
            errorDiv.style.display = 'block';
        }

        function hideError() {
            errorDiv.style.display = 'none';
        }

        function validateForm() {
            const cron = document.getElementById('cron').value.trim();
            const sourceType = document.getElementById('source-type').value;
            let errors = [];

            // CRON validation (basic: 5 parts)
            const cronParts = cron.split(/\s+/);
            if (cronParts.length !== 5) {
                errors.push('CRON expression must have 5 parts separated by spaces.');
            }

            if (sourceType === 'http') {
                const filename = document.getElementById('filename').value.trim();
                const endpoint = document.getElementById('endpoint').value.trim();
                const postprocess = document.getElementById('postprocess-script').value.trim();

                if (!filename) {
                    errors.push('Filename is required for HTTP source.');
                }
                if (!endpoint) {
                    errors.push('Endpoint URL is required for HTTP source.');
                } else if (!endpoint.match(/^https?:\/\//)) {
                    errors.push('Endpoint must be a valid URL starting with http:// or https://.');
                }
                // Postprocess optional
            } else {
                // SQL: placeholder, no validation for now
            }

            if (errors.length > 0) {
                showError(errors.join(' '));
                return false;
            }
            hideError();
            return true;
        }

        // CRON description update (basic)
        const cronInput = document.getElementById('cron');
        const cronDesc = document.getElementById('cron-description');
        cronInput.addEventListener('input', function() {
            const value = this.value.trim();
            let desc = 'Will run: ';
            if (value === '*/5 * * * *') {
                desc += 'Every 5 minutes';
            } else if (value === '* * * * *') {
                desc += 'Every minute';
            } else {
                desc += 'According to your CRON expression';
            }
            cronDesc.textContent = desc;
        });

        // Remove HTTP section (hide for now, as only one)
        document.getElementById('remove-http').addEventListener('click', function() {
            document.getElementById('http-section').style.display = 'none';
        });

        // Generate YAML Preview
        document.getElementById('generate-yaml').addEventListener('click', function() {
            hideError();
            if (!validateForm()) return;

            const cron = document.getElementById('cron').value.trim();
            const sourceType = document.getElementById('source-type').value;
            let yaml = `name: Flat Data Update

on:
  schedule:
    - cron: '${cron}'

jobs:
  update-data:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: \${{ secrets.GITHUB_TOKEN }}

`;

            if (sourceType === 'http') {
                const filename = document.getElementById('filename').value.trim();
                const endpoint = document.getElementById('endpoint').value.trim();
                const postprocess = document.getElementById('postprocess-script').value.trim();

                yaml += `      - name: Fetch data
        run: |
          curl -L -o ${filename} "${endpoint}"
`;

                if (postprocess) {
                    yaml += `      - name: Postprocess data
        run: node ${postprocess}
`;
                }

                yaml += `      - name: Commit and push changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add ${filename}
          if git diff --staged --quiet; then
            echo "No changes"
          else
            git commit -m "Update ${filename} from flat action"
            git push
          fi
`;
            } else {
                // SQL placeholder
                yaml += `      # TODO: Implement SQL fetch
        run: echo "SQL implementation pending"
`;
            }

            document.getElementById('yaml-preview').value = yaml;
            document.getElementById('save-action').style.display = 'inline-block';
        });

        // Save Flat Action
        document.getElementById('save-action').addEventListener('click', async function() {
            hideError();
            if (!validateForm()) return;

            const formData = {
                cron: document.getElementById('cron').value,
                sourceType: document.getElementById('source-type').value,
                filename: document.getElementById('filename').value,
                endpoint: document.getElementById('endpoint').value,
                postprocess: document.getElementById('postprocess-script').value,
                yaml: document.getElementById('yaml-preview').value
            };

            try {
                const response = await fetch('http://localhost:5000/api/flat/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Flat Action saved successfully!');
                    // Optionally reset form or disable button
                } else {
                    showError(result.error || 'Failed to save Flat Action.');
                }
            } catch (error) {
                console.error('Save error:', error);
                showError('Network error. Is the backend running?');
            }
        });
    }
});
