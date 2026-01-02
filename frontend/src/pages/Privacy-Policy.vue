<template>
    <main class="content-wrapper">
        <h2>Privacy and Policy</h2>
        <p>
            Last updated: 19/12/2025
        </p>
        <p>
            This policy describes how <strong> PCMASTERRACEDB </strong> collects, uses, and protects
            the personal data of the users who visit our website
            and participate in the forums or the review system.
        </p>
        <p>
            <strong>Note on User Access:</strong> Visitors may browse the PCMASTERRACEDB database and
            read forum content without an account. However, to write reviews,
            post in forums, or save your contribution history,
            user registration and authentication are required.
        </p>
        <h2>2. Types of Data Collected</h2>
        <h3>2.1 Data Provided Voluntarily by the User</h3>
        <ul>
            <li><strong>Account Details:</strong> Username and Email address.</li>
            <li><strong>Security:</strong> Password (stored in hashed form only, never in plain text).</li>
            <li><strong>User Content:</strong> Game reviews, forum posts, comments, and replies published within the
                platform.</li>
            <li><strong>Private Communications:</strong> Private messages exchanged with other users.</li>
        </ul>

        <h3>2.2 Data Collected Automatically</h3>
        <ul>
            <li>IP address and technical logs (date/time of access, user agent).</li>
            <li>Cookies and session identifiers.</li>
            <li>Third-party tools for CAPTCHA, analytics, and anti-spam protection.</li>
        </ul>

        <h2>3. Purposes of Data Processing</h2>
        <p>We process personal data for the following purposes:</p>
        <ul>
            <li>Managing user registration and maintaining your personal review/comment history.</li>
            <li>Operating the gaming forums and allowing users to publish game reviews.</li>
            <li>Preventing abuse, spam, and unauthorized activity.</li>
            <li>Ensuring the stability and security of PCMASTERRACEDB.</li>
            <li>Complying with legal obligations.</li>
        </ul>

        <h2>4. Legal Basis for Processing</h2>
        <p>We process data based on:</p>
        <ul>
            <li><strong>User consent:</strong> For registration and profile creation.</li>
            <li><strong>Performance of a contract:</strong> To provide the forum and review features you signed up for.
            </li>
            <li><strong>Legitimate interest:</strong> To maintain site security and moderate community content.</li>
            <li><strong>Legal obligation:</strong> When required by law enforcement or authorities.</li>
        </ul>

        <h2>5. Data Retention</h2>
        <p>Personal data is retained as long as your account is active. Please note that forum posts and game reviews
            may remain visible to the public even after an account is closed to maintain the context of discussions,
            unless a specific request for removal is made.</p>

        <h2>6. Data Sharing and Transfers</h2>
        <p>We do not sell your personal data. We only share data with:</p>
        <ul>
            <li>Technical providers (Hosting, CDN).</li>
            <li>Anti-spam and bot-prevention services.</li>
            <li>Legal authorities when strictly necessary.</li>
        </ul>

        <h2>7. Cookies</h2>
        <p>PCMASTERRACEDB uses essential cookies to keep you logged in and functional cookies to remember your
            preferences.
            You can manage cookie settings through your browser, but some features (like posting reviews) may break
            without them.</p>

        <h2>8. User Rights</h2>
        <p>Under the GDPR, you have the right to access, rectify, or delete your data, and the right to data
            portability.
            To exercise these rights, please contact us at the email provided in Section 1.</p>

        <h2>9. Forum & Review Visibility</h2>
        <p><strong>PCMASTERRACEDB is a public platform.</strong> Any information you post in reviews or forums is
            visible to all visitors.
            We advise against sharing sensitive personal information in your public posts.</p>

        <h2>10. Changes to This Policy</h2>
        <p>We may update this policy periodically. Continued use of PCMASTERRACEDB after
            changes are posted constitutes acceptance of the new terms.</p>
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
    li{
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