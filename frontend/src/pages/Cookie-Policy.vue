<template>
    <main class="content-wrapper">
        <h2>Cookie Policy</h2>
        <p class="last-updated">Last updated: January 2, 2026</p>

        <p>This Cookie Policy explains how <strong>PCMASTERRACEDB</strong> (“we”, “our”, “the Service”) uses cookies and
            similar technologies to provide our database and forum services.</p>

        <h2>1. What Are Cookies?</h2>
        <p>Cookies are small text files stored on your device that help us provide core functionality, improve
            performance, and understand how the website is used.</p>

        <h2>2. Types of Cookies We Use</h2>

        <h3>2.1 Essential Cookies</h3>
        <p>Required for the website and forum to function. These include:</p>
        <ul>
            <li><strong>Session cookies:</strong> Keeps you logged in as you browse.</li>
            <li><strong>Authentication tokens:</strong> Verifies your identity for reviews and posts.</li>
            <li><strong>Security/anti-CSRF cookies:</strong> Protects your account from malicious attacks.</li>
        </ul>
        <p>
            <strong>Note:</strong> You cannot disable these, as the site won't work without them.
        </p>

        <h3>2.2 Functional Cookies (Optional)</h3>
        <p>Used to remember user preferences such as:</p>
        <ul>
            <li>Language settings</li>
            <li>Dark mode/Display settings</li>
            <li>Forum notification preferences</li>
        </ul>

        <h3>2.3 Analytics Cookies (Optional)</h3>
        <p>Used to collect anonymized information about:</p>
        <ul>
            <li>Page views and popular database entries</li>
            <li>User navigation paths</li>
            <li>Performance metrics</li>
        </ul>
        <p><em>(Only active if you accept them.)</em></p>

        <h3>2.4 Third-Party Cookies</h3>
        <p>May be set by:</p>
        <ul>
            <li>CAPTCHA or anti-bot providers (to keep the forums spam-free)</li>
            <li>Embedded content (e.g., hardware review videos)</li>
            <li>Optional analytics tools</li>
        </ul>
        <p>These providers follow their own privacy policies.</p>

        <h2>3. Managing Cookies</h2>
        <p>You can manage or delete cookies through your browser settings. If you disable essential cookies, the forum
            and review system may not function correctly.</p>

        <h2>4. Changes to this Cookie Policy</h2>
        <p>We may update this policy at any time. Changes will be published on this page to ensure our community stays
            informed.</p>
    </main>
</template>
<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;

h2 {
    font-size: 2.5rem;
}

p {
    font-size: 1.5rem;
    padding-top: 2%;
}

ul {

    padding-bottom: 2%;

    li {
        font-size: 1.5rem;
        padding-top: 1%;
        padding-bottom: 2%;
    }
}

.content-wrapper {
    margin: 0 auto;
    max-width: 1200px;
    padding: 0 20px;
    padding-bottom: 3%;
    padding-top: 5%;
    align-items: center;
}
</style>