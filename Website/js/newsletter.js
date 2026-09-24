(() => {
  'use strict';

  // ============================================
  // MAILING LIST SIGNUP (Kit)
  // ============================================
  // Posts straight to the Kit form endpoint in each form's `action`.
  // Kit sends `access-control-allow-origin: *`, so the fetch succeeds
  // cross-origin and we can show an inline result instead of navigating
  // away to Kit's hosted confirmation page.
  document.querySelectorAll('.newsletter-form').forEach(form => {
    const status = form.querySelector('.form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitLabel = submitBtn.textContent;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing up...';
      status.className = 'form-status';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });

        // Kit answers 200 even when it REJECTS the signup, so the HTTP status
        // says nothing. The JSON body is the only real signal: it carries
        // status 'success' or 'failed', with the reasons in errors.messages.
        const result = await response.json().catch(() => null);

        // An unreadable body means the POST went through but we can't read the
        // verdict; don't cry wolf. Only an explicit non-success counts as failure.
        if (!response.ok || (result && result.status && result.status !== 'success')) {
          const messages = result && result.errors && Array.isArray(result.errors.messages)
            ? result.errors.messages.join(' ')
            : '';
          throw new Error(messages || 'We could not sign you up. Please try again.');
        }

        // Forms with GDPR consent turned on finish on a Kit-hosted page.
        if (result && result.consent && result.consent.enabled && result.consent.url) {
          window.location.href = result.consent.url;
          return;
        }

        status.textContent = 'You\u2019re on the list. If this is your first time signing up, check your email for a confirmation link.';
        status.className = 'form-status success';
        form.reset();
      } catch (err) {
        if (err instanceof TypeError) {
          // Network or CORS failure: fall back to a plain form POST, which
          // lands on Kit's own confirmation page rather than dead-ending.
          form.submit();
          return;
        }
        status.textContent = err.message || 'Failed to sign up. Please try again or email us directly.';
        status.className = 'form-status error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = submitLabel;
      }
    });
  });
})();
