/**
 * data.js — MITRE ATT&CK Framework Data Store
 *
 * All 14 tactics in lifecycle (kill chain) order, each containing:
 *   - Tactic metadata (id, name, description, icon, color)
 *   - techniques[] — common techniques for that tactic
 *     - Each technique has mitigations[] for the Defense Builder activity
 *
 * Source: MITRE ATT&CK® (https://attack.mitre.org)
 * Data is stored as plain JavaScript arrays/objects so no server is required.
 */

const MITRE_DATA = {

  // ============================================================
  //  TACTICS — 14 tactics in attack lifecycle order
  //  order: 1 (Recon) → 14 (Impact)
  // ============================================================
  tactics: [

    // ── 1. RECONNAISSANCE ──────────────────────────────────────
    {
      id: 'TA0043',
      order: 1,
      name: 'Reconnaissance',
      shortDesc: 'Gather information to plan the attack',
      description: 'The adversary is trying to gather information they can use to plan future operations. Reconnaissance involves actively or passively collecting data about the target: IP ranges, employee names, email formats, technologies used, and more. This phase happens BEFORE any attack payload is delivered.',
      icon: '🔍',
      color: '#ff6b35',
      techniques: [
        {
          id: 'T1595',
          name: 'Active Scanning',
          description: 'Adversaries directly probe victim infrastructure using tools like Nmap, Masscan, or Shodan to discover open ports, running services, and exploitable vulnerabilities. Active scanning is detectable if you are monitoring your network perimeter.',
          difficulty: 'Beginner',
          mitigations: [
            { id: 'M1056', name: 'Pre-compromise Controls', description: 'Implement rate-limiting and firewall rules that block common scanner signatures. Monitor perimeter logs for sequential port probing patterns.' },
            { id: 'M1030', name: 'Network Segmentation', description: 'Segment networks so external scans reveal as little surface area as possible. Only expose services that must be public.' }
          ]
        },
        {
          id: 'T1598',
          name: 'Phishing for Information',
          description: 'Adversaries send phishing messages specifically designed to harvest information (credentials, org structure, email formats) rather than to deliver malware. Often disguised as surveys, HR forms, or IT requests.',
          difficulty: 'Beginner',
          mitigations: [
            { id: 'M1017', name: 'User Awareness Training', description: 'Run regular phishing simulations. Teach staff to verify identity before sharing information, even with apparent internal requests.' },
            { id: 'M1054', name: 'Email Security Configuration', description: 'Tag external sender emails. Deploy DMARC, DKIM, and SPF to reduce spoofing.' }
          ]
        },
        {
          id: 'T1591',
          name: 'Gather Victim Org Information',
          description: 'Adversaries research the target organization using OSINT: job postings reveal technology stacks, org charts expose key targets, LinkedIn shows reporting structures, press releases name critical projects.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1056', name: 'Pre-compromise Controls', description: 'Audit publicly available information about your org. Remove unnecessary details from job postings, websites, and social media.' }
          ]
        },
        {
          id: 'T1593',
          name: 'Search Open Websites / Domains',
          description: 'Adversaries search Google, LinkedIn, GitHub, WHOIS, and Shodan for exposed credentials, configuration files, sensitive documents, or leaked source code.',
          difficulty: 'Beginner',
          mitigations: [
            { id: 'M1056', name: 'Pre-compromise Controls', description: 'Use Google Dorking on your own org to find exposed data. Audit GitHub repos for secrets. Set up alerts for your domain on breach databases.' }
          ]
        },
        {
          id: 'T1589',
          name: 'Gather Victim Identity Information',
          description: 'Adversaries collect employee names, email addresses, phone numbers, and credentials from social media, breach databases, or professional networking sites. Used to craft targeted spearphishing campaigns.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1056', name: 'Pre-compromise Controls', description: 'Subscribe to breach notification services (Have I Been Pwned). Limit personal information on corporate directories.' }
          ]
        }
      ]
    },

    // ── 2. RESOURCE DEVELOPMENT ────────────────────────────────
    {
      id: 'TA0042',
      order: 2,
      name: 'Resource Development',
      shortDesc: 'Build tools and infrastructure for the operation',
      description: 'The adversary establishes the resources they will need: purchasing or hijacking servers, registering lookalike domains, building custom malware, or compromising third-party accounts. This happens before the attack begins and is often invisible to defenders.',
      icon: '🏗️',
      color: '#ff4500',
      techniques: [
        {
          id: 'T1583',
          name: 'Acquire Infrastructure',
          description: 'Adversaries rent or purchase servers, VPS instances, cloud accounts, or botnet capacity to host payloads, run C2 servers, or conduct phishing campaigns — all using anonymous payment methods.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1056', name: 'Pre-compromise Controls', description: 'Monitor threat intelligence feeds for infrastructure being staged against your sector. Use domain monitoring services to catch lookalike domains early.' }
          ]
        },
        {
          id: 'T1586',
          name: 'Compromise Accounts',
          description: 'Adversaries take over legitimate email, social media, or cloud accounts via credential stuffing or phishing to use as trusted launchpads for future attacks.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1032', name: 'Multi-factor Authentication', description: 'MFA significantly reduces the risk of account takeover even when credentials are compromised.' }
          ]
        },
        {
          id: 'T1587',
          name: 'Develop Capabilities',
          description: 'Nation-state and sophisticated threat actors build custom malware, exploits, or attack tools from scratch to avoid detection by signatures that target known tools.',
          difficulty: 'Advanced',
          mitigations: [
            { id: 'M1056', name: 'Pre-compromise Controls', description: 'Focus on behavioral detection rather than signature-based IOCs. Subscribe to threat intel sharing communities (ISACs).' }
          ]
        },
        {
          id: 'T1588',
          name: 'Obtain Capabilities',
          description: 'Adversaries purchase exploit kits, ready-made malware, or access-as-a-service from underground markets (darkweb forums, Telegram channels) to reduce development time.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1056', name: 'Pre-compromise Controls', description: 'Use threat intelligence to track commodity malware families. EDR solutions updated with latest signatures reduce the effectiveness of bought tools.' }
          ]
        },
        {
          id: 'T1585',
          name: 'Establish Accounts',
          description: 'Adversaries create fake profiles on LinkedIn, GitHub, or email providers to send phishing from seemingly legitimate new accounts that bypass reputation-based filters.',
          difficulty: 'Beginner',
          mitigations: [
            { id: 'M1056', name: 'Pre-compromise Controls', description: 'Educate staff to verify identities through known channels. Report impersonation accounts to platform trust & safety teams.' }
          ]
        }
      ]
    },

    // ── 3. INITIAL ACCESS ──────────────────────────────────────
    {
      id: 'TA0001',
      order: 3,
      name: 'Initial Access',
      shortDesc: 'Get a foothold inside the target network',
      description: 'The adversary uses various entry vectors to gain their initial foothold. This is the moment the attack crosses the perimeter. Common entry points include phishing emails, exploiting public-facing applications, stolen credentials, and compromised supply chains.',
      icon: '🚪',
      color: '#dc143c',
      techniques: [
        {
          id: 'T1566',
          name: 'Phishing',
          description: 'Adversaries send emails with malicious attachments (macro-enabled Office docs, PDFs, ISO files) or links to credential-harvesting pages. Spearphishing targets specific individuals; whaling targets executives.',
          difficulty: 'Beginner',
          mitigations: [
            { id: 'M1049', name: 'Antivirus / Antimalware', description: 'Deploy email gateway scanning with sandbox detonation of attachments.' },
            { id: 'M1017', name: 'User Training', description: 'Phishing simulation programs dramatically reduce click rates. Teach users to hover before clicking links.' },
            { id: 'M1054', name: 'Software Configuration', description: 'Disable Office macros from the internet by policy. Block dangerous file types at the email gateway.' }
          ]
        },
        {
          id: 'T1190',
          name: 'Exploit Public-Facing Application',
          description: 'Adversaries exploit unpatched vulnerabilities in internet-facing systems — VPN appliances, web applications, Exchange servers, firewalls — to gain access without user interaction.',
          difficulty: 'Advanced',
          mitigations: [
            { id: 'M1051', name: 'Update Software', description: 'Patch internet-facing systems within 24–72 hours of a critical CVE disclosure. Prioritize systems with known active exploitation.' },
            { id: 'M1048', name: 'Application Isolation & Sandboxing', description: 'Deploy a WAF. Isolate public-facing systems in a DMZ separate from internal networks.' }
          ]
        },
        {
          id: 'T1078',
          name: 'Valid Accounts',
          description: 'Adversaries use stolen credentials (from phishing, credential dumps, or purchase on darkweb) to log in as a legitimate user. This bypasses most perimeter controls since the login appears normal.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1032', name: 'Multi-factor Authentication', description: 'MFA is the single most effective control against stolen credentials. Implement for all remote access and privileged accounts.' },
            { id: 'M1027', name: 'Password Policies', description: 'Require long, complex passwords. Block previously breached passwords using tools like Have I Been Pwned API.' }
          ]
        },
        {
          id: 'T1195',
          name: 'Supply Chain Compromise',
          description: 'Adversaries compromise a trusted software vendor, hardware supplier, or IT service provider (MSP) and use that trust relationship to reach thousands of victims — as seen in SolarWinds and 3CX attacks.',
          difficulty: 'Advanced',
          mitigations: [
            { id: 'M1051', name: 'Update Software', description: 'Verify software integrity using cryptographic hashes and code-signing certificates. Vet third-party software security practices.' },
            { id: 'M1016', name: 'Vulnerability Scanning', description: 'Assess third-party software risk. Monitor vendor security advisories continuously.' }
          ]
        },
        {
          id: 'T1091',
          name: 'Replication Through Removable Media',
          description: 'Adversaries use infected USB drives (sometimes dropped in parking lots — "baiting") to reach air-gapped or isolated environments. Malware auto-executes when media is inserted.',
          difficulty: 'Beginner',
          mitigations: [
            { id: 'M1042', name: 'Disable or Remove Feature', description: 'Disable AutoRun/AutoPlay via Group Policy. Use endpoint controls that block unauthorized USB devices.' },
            { id: 'M1034', name: 'Limit Hardware Installation', description: 'Enforce USB device whitelisting on endpoints using EDR or MDM policies.' }
          ]
        }
      ]
    },

    // ── 4. EXECUTION ───────────────────────────────────────────
    {
      id: 'TA0002',
      order: 4,
      name: 'Execution',
      shortDesc: 'Run malicious code on the target system',
      description: 'The adversary runs their malicious code. Execution can happen through many vectors: clicking a malicious link, opening an infected document, or the attacker running commands remotely. The goal is to get code running in the target environment.',
      icon: '💻',
      color: '#cc0000',
      techniques: [
        {
          id: 'T1059',
          name: 'Command and Scripting Interpreter',
          description: 'Adversaries use built-in interpreters — PowerShell, cmd.exe, Bash, Python, VBScript — to execute malicious commands. These are "living off the land" (LOtL) techniques that abuse trusted OS tools.',
          difficulty: 'Beginner',
          mitigations: [
            { id: 'M1038', name: 'Execution Prevention', description: 'Use AppLocker or Windows Defender Application Control (WDAC) to limit script execution to signed scripts.' },
            { id: 'M1042', name: 'Disable or Remove Feature', description: 'Disable Windows Script Host (WSH) and PowerShell v2 where not needed. Use PowerShell Constrained Language Mode.' }
          ]
        },
        {
          id: 'T1203',
          name: 'Exploitation for Client Execution',
          description: 'Adversaries exploit memory corruption vulnerabilities in client applications (browsers, Office, PDF readers) so that opening a malicious document or visiting a URL executes attacker code.',
          difficulty: 'Advanced',
          mitigations: [
            { id: 'M1048', name: 'Application Isolation', description: 'Run browsers and document readers in sandboxes. Use virtualization-based security.' },
            { id: 'M1050', name: 'Exploit Protection', description: 'Enable DEP, ASLR, and Control Flow Guard system-wide. Use Microsoft EMET or Windows Defender Exploit Guard.' }
          ]
        },
        {
          id: 'T1204',
          name: 'User Execution',
          description: 'Adversaries rely on users themselves to execute the payload — double-clicking an attachment, running a fake installer, or following instructions to "enable content." Social engineering makes the user the attack vector.',
          difficulty: 'Beginner',
          mitigations: [
            { id: 'M1017', name: 'User Training', description: 'Teach users to verify file sources. Run awareness campaigns about fake software installers and "enable macros" social engineering.' },
            { id: 'M1038', name: 'Execution Prevention', description: 'Application control blocks unauthorized executables regardless of who tries to run them.' }
          ]
        },
        {
          id: 'T1053',
          name: 'Scheduled Task / Job',
          description: 'Adversaries create scheduled tasks (Windows Task Scheduler, cron jobs, at) to execute malicious code at a specific time, on a recurring schedule, or upon system events like login.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1026', name: 'Privileged Account Management', description: 'Restrict who can create scheduled tasks. Monitor for tasks created by non-admin accounts.' },
            { id: 'M1047', name: 'Audit', description: 'Regularly review all scheduled tasks and cron entries. Alert on new tasks with encoded or obfuscated commands.' }
          ]
        },
        {
          id: 'T1047',
          name: 'Windows Management Instrumentation (WMI)',
          description: 'WMI is a powerful Windows management framework that adversaries abuse to run commands locally or on remote systems, often bypassing traditional execution controls. Used heavily by APT groups.',
          difficulty: 'Advanced',
          mitigations: [
            { id: 'M1026', name: 'Privileged Account Management', description: 'Restrict WMI access using firewall rules. Disable WMI service on systems that do not require it.' },
            { id: 'M1040', name: 'Behavior Prevention on Endpoint', description: 'EDR solutions can detect abnormal WMI process creation chains and remote WMI invocations.' }
          ]
        }
      ]
    },

    // ── 5. PERSISTENCE ─────────────────────────────────────────
    {
      id: 'TA0003',
      order: 5,
      name: 'Persistence',
      shortDesc: 'Maintain access across reboots and credential changes',
      description: 'Adversaries establish persistence so they survive reboots, password changes, and remediation attempts. Without persistence, attackers lose access when the infected process terminates. Persistence mechanisms range from simple registry keys to complex rootkits.',
      icon: '⚓',
      color: '#b22222',
      techniques: [
        {
          id: 'T1547',
          name: 'Boot or Logon Autostart Execution',
          description: 'Adversaries configure malware to launch automatically on boot or user login using Windows registry Run keys, Startup folders, login hooks, or init scripts. One of the most common persistence mechanisms.',
          difficulty: 'Beginner',
          mitigations: [
            { id: 'M1047', name: 'Audit', description: 'Monitor registry Run keys and Startup folder for new or modified entries. Use Sysinternals Autoruns to audit startup locations.' },
            { id: 'M1018', name: 'User Account Management', description: 'Standard users should not be able to modify HKLM Run keys. Enforce with proper permissions.' }
          ]
        },
        {
          id: 'T1136',
          name: 'Create Account',
          description: 'Adversaries create new local or domain accounts to maintain persistent access — even if their initial foothold is discovered and removed. Often given names similar to legitimate service accounts.',
          difficulty: 'Beginner',
          mitigations: [
            { id: 'M1032', name: 'Multi-factor Authentication', description: 'MFA limits the usefulness of backdoor accounts created by attackers.' },
            { id: 'M1028', name: 'Operating System Configuration', description: 'Alert on new account creation, especially accounts with admin privileges. Require change-management approval for new accounts.' }
          ]
        },
        {
          id: 'T1505',
          name: 'Server Software Component',
          description: 'Adversaries install web shells (ASPXspy, China Chopper), malicious IIS modules, or backdoored plugins on servers. Web shell access looks like normal HTTPS traffic and persists independently of OS-level accounts.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1047', name: 'Audit', description: 'Use File Integrity Monitoring (FIM) on web server directories. Alert on new files or unexpected changes to existing server-side code.' },
            { id: 'M1042', name: 'Disable or Remove Feature', description: 'Remove unused web server extensions. Restrict write permissions on web root directories.' }
          ]
        },
        {
          id: 'T1543',
          name: 'Create or Modify System Process',
          description: 'Adversaries install malicious services, LaunchDaemons, or systemd units that start automatically and run with elevated privileges, providing stealthy long-term persistence.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1047', name: 'Audit', description: 'Monitor for new service creation events (Event ID 7045 on Windows). Alert on services with encoded PowerShell in their binPath.' },
            { id: 'M1018', name: 'User Account Management', description: 'Restrict who can create system services. Require approval workflows for new service installation.' }
          ]
        },
        {
          id: 'T1078',
          name: 'Valid Accounts (Persistence)',
          description: 'Adversaries use legitimate credentials as a persistent backdoor. Since valid-account logins are expected, this blends with normal activity and survives most incident response actions that focus on malware removal.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1027', name: 'Password Policies', description: 'Force password resets on all accounts after an incident. Monitor for logins at unusual times or from unusual locations.' },
            { id: 'M1036', name: 'Account Use Policies', description: 'Implement UEBA to baseline and alert on anomalous account behavior.' }
          ]
        }
      ]
    },

    // ── 6. PRIVILEGE ESCALATION ────────────────────────────────
    {
      id: 'TA0004',
      order: 6,
      name: 'Privilege Escalation',
      shortDesc: 'Gain higher-level permissions on the system',
      description: 'After gaining initial access (often as a low-privilege user), adversaries need to escalate to admin, SYSTEM, or root privileges to access sensitive data, disable defenses, and move laterally. Privilege escalation is often the key step that determines breach severity.',
      icon: '⬆️',
      color: '#ff8c00',
      techniques: [
        {
          id: 'T1068',
          name: 'Exploitation for Privilege Escalation',
          description: 'Adversaries exploit OS kernel vulnerabilities, driver flaws, or setuid binaries (Linux) to elevate from a regular user to SYSTEM/root. Examples: EternalBlue, PrintNightmare, DirtyPipe.',
          difficulty: 'Advanced',
          mitigations: [
            { id: 'M1051', name: 'Update Software', description: 'Apply kernel and driver security patches promptly. Subscribe to vendor security advisories.' },
            { id: 'M1050', name: 'Exploit Protection', description: 'Enable kernel-level exploit mitigations: DEP, ASLR, SMEP, SMAP on Linux; VBS/HVCI on Windows.' }
          ]
        },
        {
          id: 'T1055',
          name: 'Process Injection',
          description: 'Adversaries inject malicious code (DLL injection, process hollowing, reflective loading) into legitimate, privileged processes to inherit their permissions and evade detection.',
          difficulty: 'Advanced',
          mitigations: [
            { id: 'M1040', name: 'Behavior Prevention on Endpoint', description: 'Modern EDR solutions detect process injection anomalies like cross-process memory writes and hollow process creation.' },
            { id: 'M1026', name: 'Privileged Account Management', description: 'Least-privilege principles limit which processes have high enough privilege to be worthwhile injection targets.' }
          ]
        },
        {
          id: 'T1134',
          name: 'Access Token Manipulation',
          description: 'On Windows, access tokens represent a logged-on user\'s security context. Adversaries steal (impersonate) tokens from high-privilege processes to act as SYSTEM or a domain admin without knowing their password.',
          difficulty: 'Advanced',
          mitigations: [
            { id: 'M1026', name: 'Privileged Account Management', description: 'Restrict SeImpersonatePrivilege and SeAssignPrimaryTokenPrivilege to only necessary service accounts.' },
            { id: 'M1018', name: 'User Account Management', description: 'Run services as low-privilege accounts. Audit token manipulation events in Windows security logs.' }
          ]
        },
        {
          id: 'T1548',
          name: 'Abuse Elevation Control Mechanism',
          description: 'Adversaries bypass UAC (User Account Control) on Windows or exploit sudo misconfigurations on Linux to gain elevated permissions without triggering prompts or authentication requirements.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1028', name: 'Operating System Configuration', description: 'Set UAC to "Always notify." Do not add users to the sudoers file without strict command restrictions.' },
            { id: 'M1047', name: 'Audit', description: 'Monitor for UAC bypass patterns: auto-elevation of suspicious binaries, DLL hijacking in trusted paths.' }
          ]
        },
        {
          id: 'T1611',
          name: 'Escape to Host (Container Breakout)',
          description: 'In containerized environments (Docker, Kubernetes), adversaries exploit misconfigurations (privileged containers, exposed host sockets, host namespace sharing) to break out and access the underlying host with root privileges.',
          difficulty: 'Advanced',
          mitigations: [
            { id: 'M1048', name: 'Application Isolation', description: 'Never run production containers as privileged. Avoid mounting the Docker socket into containers. Use Pod Security Admission in Kubernetes.' },
            { id: 'M1038', name: 'Execution Prevention', description: 'Apply seccomp and AppArmor profiles to containers. Use read-only root filesystems.' }
          ]
        }
      ]
    },

    // ── 7. DEFENSE EVASION ─────────────────────────────────────
    {
      id: 'TA0005',
      order: 7,
      name: 'Defense Evasion',
      shortDesc: 'Avoid detection throughout the compromise',
      description: 'The adversary actively works to avoid being detected by security tools, analysts, and automated defenses. Defense evasion is woven through the entire attack lifecycle — adversaries constantly adapt to avoid triggering alerts. This is the tactic with the most techniques in ATT&CK.',
      icon: '🥷',
      color: '#9400d3',
      techniques: [
        {
          id: 'T1562',
          name: 'Impair Defenses',
          description: 'Adversaries disable or tamper with security tools: killing AV processes, disabling Windows Defender, turning off firewalls, or uninstalling EDR agents. This is often the first thing ransomware operators do after gaining admin access.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1022', name: 'Restrict File and Directory Permissions', description: 'Protect security tool binaries and configurations with tamper protection (e.g., Microsoft Defender\'s Tamper Protection).' },
            { id: 'M1024', name: 'Restrict Registry Permissions', description: 'Alert on registry modifications to security tool configurations. Use cloud-delivered protection that cannot be easily disabled locally.' }
          ]
        },
        {
          id: 'T1027',
          name: 'Obfuscated Files or Information',
          description: 'Adversaries encode, encrypt, pack, or layer malicious code to evade signature-based antivirus detection. Common methods: Base64 encoding, custom XOR encryption, commercial packers (UPX, Themida), or living-off-the-land (LOtL) scripts.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1049', name: 'Antivirus / Antimalware', description: 'Use next-gen AV with behavioral detection, not just signatures. Behavioral detection catches obfuscated malware at execution time.' },
            { id: 'M1040', name: 'Behavior Prevention on Endpoint', description: 'Monitor for deobfuscation activity (e.g., certutil -decode, PowerShell FromBase64String) which indicates suspicious intent.' }
          ]
        },
        {
          id: 'T1070',
          name: 'Indicator Removal',
          description: 'Adversaries clear Windows Event Logs, delete bash history, remove dropped files, and overwrite timestamps (timestomping) to erase evidence of their activity and hinder forensic investigation.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1041', name: 'Encrypt Sensitive Information', description: 'Forward logs to a centralized, append-only SIEM in real time. If logs are deleted locally, the SIEM still has them.' },
            { id: 'M1029', name: 'Remote Data Storage', description: 'Store logs on isolated systems with strict write controls. Immutable log storage prevents tampering.' }
          ]
        },
        {
          id: 'T1036',
          name: 'Masquerading',
          description: 'Adversaries name malicious files and processes after legitimate system components (svchost.exe, lsass.exe, chrome.exe) or place them in expected paths to trick analysts and automated tools.',
          difficulty: 'Beginner',
          mitigations: [
            { id: 'M1022', name: 'Restrict File and Directory Permissions', description: 'Monitor process creation events for executables running from unusual paths (e.g., svchost from %TEMP%).' },
            { id: 'M1038', name: 'Execution Prevention', description: 'Whitelist by hash and path combined, not just filename. Alert on system process names run from non-system directories.' }
          ]
        },
        {
          id: 'T1218',
          name: 'System Binary Proxy Execution',
          description: 'Adversaries abuse trusted, signed Windows binaries (LOLBAS: mshta.exe, regsvr32, certutil, rundll32) to execute malicious payloads, bypassing application control policies that trust signed Microsoft binaries.',
          difficulty: 'Advanced',
          mitigations: [
            { id: 'M1038', name: 'Execution Prevention', description: 'Use WDAC policies that block specific LOLBAS abuse patterns. Monitor for unexpected arguments passed to trusted system binaries.' },
            { id: 'M1042', name: 'Disable or Remove Feature', description: 'Disable or restrict binaries like mshta.exe, regsvr32.exe if not needed by legitimate software in your environment.' }
          ]
        }
      ]
    },

    // ── 8. CREDENTIAL ACCESS ───────────────────────────────────
    {
      id: 'TA0006',
      order: 8,
      name: 'Credential Access',
      shortDesc: 'Steal account names and passwords',
      description: 'Adversaries attempt to steal credentials to gain access to additional systems, escalate privileges, or maintain persistent access. Stolen credentials are incredibly valuable — they allow attackers to blend in with legitimate users and bypass many security controls.',
      icon: '🔑',
      color: '#ffd700',
      techniques: [
        {
          id: 'T1110',
          name: 'Brute Force',
          description: 'Adversaries systematically try passwords: dictionary attacks (common passwords), password spraying (one password across many accounts to avoid lockout), or credential stuffing (using breach data). Spraying is particularly dangerous because it avoids account lockout.',
          difficulty: 'Beginner',
          mitigations: [
            { id: 'M1036', name: 'Account Use Policies', description: 'Implement account lockout after 5–10 failed attempts. Monitor and alert on high authentication failure rates.' },
            { id: 'M1032', name: 'Multi-factor Authentication', description: 'MFA renders brute-forced passwords useless without the second factor.' }
          ]
        },
        {
          id: 'T1003',
          name: 'OS Credential Dumping',
          description: 'Adversaries extract credentials from OS memory and stores: LSASS memory (using Mimikatz), SAM database, NTDS.dit (Active Directory), or /etc/shadow. This provides plaintext or crackable hashes for all users logged in or cached on the system.',
          difficulty: 'Advanced',
          mitigations: [
            { id: 'M1043', name: 'Credential Access Protection', description: 'Enable Windows Credential Guard to protect LSASS. Enable LSA Protection (Protected Process Light). Disable WDigest authentication (KB2871997).' },
            { id: 'M1027', name: 'Password Policies', description: 'Use long, unique passwords. Even if hashes are dumped, complex passwords resist offline cracking.' }
          ]
        },
        {
          id: 'T1056',
          name: 'Input Capture (Keylogging)',
          description: 'Adversaries deploy keyloggers that silently record all keystrokes, capturing credentials as users type them. More sophisticated variants hook credential APIs to capture data directly from authentication libraries.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1032', name: 'Multi-factor Authentication', description: 'Even captured passwords are useless to an attacker without the second factor.' },
            { id: 'M1049', name: 'Antivirus / Antimalware', description: 'Modern EDR solutions detect keylogger API calls and suspicious hook installation in other processes.' }
          ]
        },
        {
          id: 'T1539',
          name: 'Steal Web Session Cookie',
          description: 'Adversaries steal browser authentication cookies to impersonate logged-in users on web applications — bypassing passwords AND MFA entirely. Used extensively in BEC (Business Email Compromise) and cloud account takeovers.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1054', name: 'Software Configuration', description: 'Enforce short session timeouts. Bind session tokens to device fingerprints or IP addresses. Implement token binding.' },
            { id: 'M1032', name: 'Multi-factor Authentication', description: 'Step-up authentication for sensitive actions even with valid sessions. Evaluate Conditional Access policies that re-challenge on anomalous behavior.' }
          ]
        },
        {
          id: 'T1555',
          name: 'Credentials from Password Stores',
          description: 'Adversaries extract credentials saved in browsers (Chrome, Firefox), OS credential managers (Windows Credential Manager, macOS Keychain), and third-party password managers to harvest a trove of credentials in one step.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1027', name: 'Password Policies', description: 'Use enterprise password managers with master password enforcement. Avoid storing credentials in browser profiles on shared or high-risk systems.' },
            { id: 'M1049', name: 'Antivirus / Antimalware', description: 'Monitor for unauthorized access to browser credential database files (Chrome\'s Login Data SQLite file, etc.).' }
          ]
        }
      ]
    },

    // ── 9. DISCOVERY ───────────────────────────────────────────
    {
      id: 'TA0007',
      order: 9,
      name: 'Discovery',
      shortDesc: 'Map and understand the target environment',
      description: 'After gaining access, adversaries explore the environment to understand its layout: what systems exist, what data is stored where, what accounts have access to what. Discovery is essentially internal reconnaissance to plan the next moves.',
      icon: '🗺️',
      color: '#32cd32',
      techniques: [
        {
          id: 'T1082',
          name: 'System Information Discovery',
          description: 'Adversaries run commands (systeminfo, uname -a, hostname) to collect OS version, patch level, hardware info, and installed software — determining what exploits are applicable and how the environment is configured.',
          difficulty: 'Beginner',
          mitigations: [
            { id: 'M1028', name: 'Operating System Configuration', description: 'Restrict access to system enumeration commands for standard users. Monitor and alert on bulk system information gathering.' }
          ]
        },
        {
          id: 'T1083',
          name: 'File and Directory Discovery',
          description: 'Adversaries enumerate file systems looking for sensitive files: credential files, SSH keys, configuration files with passwords, financial documents, or intellectual property. Often done with scripts that recurse through drives.',
          difficulty: 'Beginner',
          mitigations: [
            { id: 'M1022', name: 'Restrict File and Directory Permissions', description: 'Apply least-privilege file permissions. Sensitive files (SSH keys, config files with credentials) should have restrictive ACLs.' }
          ]
        },
        {
          id: 'T1046',
          name: 'Network Service Discovery',
          description: 'Adversaries scan the internal network using tools like Nmap, PowerSploit, or Invoke-Portscan to map live hosts, open ports, and running services — identifying lateral movement targets.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1030', name: 'Network Segmentation', description: 'Micro-segmentation limits what any one compromised host can see and reach. Deploy honeypots to detect internal scanning immediately.' },
            { id: 'M1031', name: 'Network Intrusion Prevention', description: 'Internal IDS/IPS can detect port scanning patterns even on internal traffic.' }
          ]
        },
        {
          id: 'T1018',
          name: 'Remote System Discovery',
          description: 'Adversaries identify other systems on the network using ping sweeps, NetBIOS enumeration, ARP scanning, or Active Directory LDAP queries to list all computer objects in the domain.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1030', name: 'Network Segmentation', description: 'Network segmentation limits the blast radius of discovery. VLAN separation reduces what a compromised workstation can enumerate.' }
          ]
        },
        {
          id: 'T1087',
          name: 'Account Discovery',
          description: 'Adversaries enumerate user and group accounts using net user, net group, Get-ADUser, or LDAP queries. Discovering admin accounts and service accounts guides privilege escalation and lateral movement targeting.',
          difficulty: 'Beginner',
          mitigations: [
            { id: 'M1026', name: 'Privileged Account Management', description: 'Restrict LDAP query rights for regular users. Limit domain-wide user enumeration to specific administrative accounts.' },
            { id: 'M1028', name: 'Operating System Configuration', description: 'Monitor for AD enumeration tools. Alert on LDAP queries returning large numbers of user objects.' }
          ]
        }
      ]
    },

    // ── 10. LATERAL MOVEMENT ───────────────────────────────────
    {
      id: 'TA0008',
      order: 10,
      name: 'Lateral Movement',
      shortDesc: 'Spread across the network to reach objectives',
      description: 'Adversaries move from the initial foothold to other systems to reach their ultimate objective (domain controller, financial data, crown jewel systems). Lateral movement is what turns a single workstation compromise into a full network breach.',
      icon: '↔️',
      color: '#00ced1',
      techniques: [
        {
          id: 'T1021',
          name: 'Remote Services',
          description: 'Adversaries use legitimate remote access protocols — RDP (3389), SSH (22), SMB (445), WinRM — with stolen credentials to connect to other systems. Appears as authorized access in logs.',
          difficulty: 'Beginner',
          mitigations: [
            { id: 'M1035', name: 'Limit Access to Resource Over Network', description: 'Restrict RDP and SSH access using firewall rules and jump servers. Disable RDP on systems that do not require it.' },
            { id: 'M1032', name: 'Multi-factor Authentication', description: 'Require MFA for all remote access services, especially RDP.' }
          ]
        },
        {
          id: 'T1550',
          name: 'Use Alternate Authentication Material',
          description: 'Adversaries authenticate without plaintext passwords using captured NTLM hashes (Pass-the-Hash), Kerberos tickets (Pass-the-Ticket), or Kerberoastable service account hashes to move laterally across Windows domains.',
          difficulty: 'Advanced',
          mitigations: [
            { id: 'M1043', name: 'Credential Access Protection', description: 'Enable Windows Credential Guard to protect NTLM hashes and Kerberos tickets from extraction. Implement Protected Users security group.' },
            { id: 'M1026', name: 'Privileged Account Management', description: 'Use unique local admin passwords (LAPS) to prevent Pass-the-Hash spreading across systems.' }
          ]
        },
        {
          id: 'T1534',
          name: 'Internal Spearphishing',
          description: 'Adversaries send phishing messages from compromised internal accounts. Receiving a phishing link from a known colleague dramatically increases click rates. Used to spread malware or steal credentials from additional internal victims.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1049', name: 'Antivirus / Antimalware', description: 'Scan internal email traffic for malicious content, not just external email. Zero-trust architecture prevents implicit trust of internal senders.' },
            { id: 'M1017', name: 'User Training', description: 'Train users to verify unusual internal requests via a secondary channel (phone call, Teams message to a known contact).' }
          ]
        },
        {
          id: 'T1570',
          name: 'Lateral Tool Transfer',
          description: 'Adversaries transfer hacking tools, additional malware, or scripts to other systems via shared folders, SMB, SCP, or web downloads to enable operations on newly accessed systems.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1037', name: 'Filter Network Traffic', description: 'Monitor for unusual file transfers between internal systems. Restrict SMB access between workstations.' },
            { id: 'M1031', name: 'Network Intrusion Prevention', description: 'IDS rules can detect known tool signatures being transferred internally.' }
          ]
        },
        {
          id: 'T1080',
          name: 'Taint Shared Content',
          description: 'Adversaries place malicious files (modified documents, AutoRun scripts) on network shares, SharePoint, or shared drives. When other users open or execute the tainted content, their systems become infected.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1022', name: 'Restrict File and Directory Permissions', description: 'Apply least-privilege ACLs to shared drives. Users should only write to their own directories, not shared folders.' },
            { id: 'M1049', name: 'Antivirus / Antimalware', description: 'Enable real-time scanning on file shares. Alert on new executable files appearing in shared directories.' }
          ]
        }
      ]
    },

    // ── 11. COLLECTION ─────────────────────────────────────────
    {
      id: 'TA0009',
      order: 11,
      name: 'Collection',
      shortDesc: 'Gather data of interest before exfiltration',
      description: 'Adversaries gather the target data before exfiltrating it. This phase determines WHAT is stolen — financial records, intellectual property, credentials, communications, or other sensitive data. Adversaries often stage and compress data before sending it out.',
      icon: '📦',
      color: '#ff69b4',
      techniques: [
        {
          id: 'T1005',
          name: 'Data from Local System',
          description: 'Adversaries collect files from the compromised system: documents, spreadsheets, database files, configuration files, or anything matching keywords of interest. Often done with scripts that search for file types or keywords.',
          difficulty: 'Beginner',
          mitigations: [
            { id: 'M1057', name: 'Data Loss Prevention', description: 'Deploy DLP solutions that detect bulk file access or copying. Alert on large numbers of files being accessed by a single process.' },
            { id: 'M1041', name: 'Encrypt Sensitive Information', description: 'Encrypt sensitive data at rest so even if collected, the files are unreadable without decryption keys.' }
          ]
        },
        {
          id: 'T1114',
          name: 'Email Collection',
          description: 'Adversaries access email accounts to harvest communications, credentials shared in emails, business intelligence, or set up forwarding rules to receive ongoing intelligence. A major component of Business Email Compromise (BEC).',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1032', name: 'Multi-factor Authentication', description: 'MFA protects email accounts even when credentials are stolen.' },
            { id: 'M1047', name: 'Audit', description: 'Alert on email forwarding rules to external addresses. Monitor for unusual email export activity (e.g., downloading the entire mailbox via EWS).' }
          ]
        },
        {
          id: 'T1113',
          name: 'Screen Capture',
          description: 'Adversaries take periodic screenshots of the victim\'s screen to capture displayed sensitive information: passwords on sticky notes, documents open in editors, chat messages, or financial data in browsers.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1049', name: 'Antivirus / Antimalware', description: 'EDR solutions monitor for suspicious use of screen capture APIs (BitBlt, GDI+) from untrusted processes.' }
          ]
        },
        {
          id: 'T1560',
          name: 'Archive Collected Data',
          description: 'Adversaries compress (ZIP, RAR, 7z) and often encrypt collected data before exfiltration to reduce transfer size, avoid content-inspection DLP tools, and protect their haul if intercepted.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1057', name: 'Data Loss Prevention', description: 'Monitor for mass file compression activity. Alert on creation of large encrypted archives, especially followed by outbound network connections.' }
          ]
        },
        {
          id: 'T1056',
          name: 'Input Capture (Collection)',
          description: 'Keyloggers deployed during Credential Access continue to collect sensitive data beyond just credentials: typed documents, search queries, chat messages, and form submissions containing valuable intelligence.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1040', name: 'Behavior Prevention on Endpoint', description: 'EDR can detect API hooking and keylogging behaviors indicative of input capture malware.' }
          ]
        }
      ]
    },

    // ── 12. COMMAND AND CONTROL ────────────────────────────────
    {
      id: 'TA0011',
      order: 12,
      name: 'Command and Control',
      shortDesc: 'Communicate with and control compromised systems',
      description: 'Adversaries establish a covert communication channel (C2) to issue commands to compromised systems, receive data, and update their tools remotely. C2 channels are designed to blend with legitimate traffic to avoid detection by network security tools.',
      icon: '📡',
      color: '#4169e1',
      techniques: [
        {
          id: 'T1071',
          name: 'Application Layer Protocol',
          description: 'Adversaries use HTTP/S, DNS, SMTP, or other common application protocols for C2 traffic. HTTPS C2 is particularly stealthy because it is encrypted and blends with normal web browsing. Cobalt Strike, Metasploit, and most commercial C2 frameworks use this technique.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1031', name: 'Network Intrusion Prevention', description: 'Use TLS inspection proxies to inspect HTTPS traffic. Monitor for beaconing patterns (regular intervals of small outbound connections).' },
            { id: 'M1037', name: 'Filter Network Traffic', description: 'Proxy all HTTP/S traffic through an inspecting proxy. Block direct internet access from servers. Use DNS filtering to block known C2 domains.' }
          ]
        },
        {
          id: 'T1572',
          name: 'Protocol Tunneling',
          description: 'Adversaries encapsulate C2 traffic inside allowed protocols — DNS tunneling (data in DNS queries), ICMP tunneling, or SSH tunneling — to bypass firewalls that allow these protocols but do not inspect their content.',
          difficulty: 'Advanced',
          mitigations: [
            { id: 'M1037', name: 'Filter Network Traffic', description: 'Restrict outbound ICMP. Monitor DNS query frequency and response size for tunneling indicators (queries should be short; tunneling creates long, high-frequency queries).' },
            { id: 'M1031', name: 'Network Intrusion Prevention', description: 'Deploy DNS security tools (Cisco Umbrella, Infoblox) that detect DNS tunneling patterns.' }
          ]
        },
        {
          id: 'T1090',
          name: 'Proxy',
          description: 'Adversaries route C2 traffic through proxy servers, Tor exit nodes, or a chain of compromised systems to hide the true origin of communications and make attribution harder.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1037', name: 'Filter Network Traffic', description: 'Block connections to known Tor exit nodes and commercial anonymization services. Restrict outbound traffic to approved destinations only.' }
          ]
        },
        {
          id: 'T1102',
          name: 'Web Service (Dead Drop Resolvers)',
          description: 'Adversaries use legitimate web services — GitHub Gists, Pastebin, Twitter, Google Docs — as C2 channels or to host configuration data. Network security tools rarely block these trusted services.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1031', name: 'Network Intrusion Prevention', description: 'Monitor for unusual access patterns to legitimate web services (frequency, payload size, timing). Apply user-agent and behavior analytics.' }
          ]
        },
        {
          id: 'T1095',
          name: 'Non-Application Layer Protocol',
          description: 'Adversaries use raw TCP/UDP sockets or ICMP as C2 channels to communicate at the network layer, bypassing application-layer proxies and inspection tools that only examine known protocols.',
          difficulty: 'Advanced',
          mitigations: [
            { id: 'M1037', name: 'Filter Network Traffic', description: 'Implement egress filtering that only permits explicitly allowed protocols and ports. Block raw ICMP outbound except for essential monitoring.' }
          ]
        }
      ]
    },

    // ── 13. EXFILTRATION ───────────────────────────────────────
    {
      id: 'TA0010',
      order: 13,
      name: 'Exfiltration',
      shortDesc: 'Steal data out of the target network',
      description: 'Adversaries steal the collected data, sending it to an attacker-controlled location. Exfiltration is the moment the organization "loses" its data. Adversaries use various techniques to bypass DLP controls and blend exfiltration traffic with normal activity.',
      icon: '📤',
      color: '#ff4500',
      techniques: [
        {
          id: 'T1041',
          name: 'Exfiltration Over C2 Channel',
          description: 'Adversaries exfiltrate data through the same C2 channel they use for commands, reducing the number of suspicious connections that need to be established and making exfiltration harder to distinguish from normal C2 beaconing.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1057', name: 'Data Loss Prevention', description: 'Monitor outbound C2 traffic volume. Unusual data volumes through the C2 channel indicate exfiltration in progress.' }
          ]
        },
        {
          id: 'T1048',
          name: 'Exfiltration Over Alternative Protocol',
          description: 'Adversaries use protocols not normally associated with data transfer — DNS, ICMP, FTP, SMTP — to send data out. DNS exfiltration encodes data in subdomain labels of DNS queries, evading many DLP tools.',
          difficulty: 'Advanced',
          mitigations: [
            { id: 'M1037', name: 'Filter Network Traffic', description: 'Block direct outbound DNS except through corporate resolvers. Monitor for abnormally large or frequent DNS queries indicating data exfiltration.' },
            { id: 'M1057', name: 'Data Loss Prevention', description: 'Deploy DLP that inspects all outbound protocols, not just HTTP/S.' }
          ]
        },
        {
          id: 'T1567',
          name: 'Exfiltration Over Web Service',
          description: 'Adversaries upload stolen data to legitimate cloud storage services (Dropbox, Google Drive, OneDrive, Box, Mega) or code repositories (GitHub) that organizations rarely block and DLP tools often cannot inspect.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1057', name: 'Data Loss Prevention', description: 'Deploy CASB (Cloud Access Security Broker) to monitor uploads to cloud storage. Block unauthorized cloud storage services.' },
            { id: 'M1021', name: 'Restrict Web-Based Content', description: 'Only allow access to approved cloud services. Inspect and limit upload sizes on approved services.' }
          ]
        },
        {
          id: 'T1537',
          name: 'Transfer Data to Cloud Account',
          description: 'In cloud environments, adversaries use native cloud features (S3 sync, Azure blob copy, GCP gsutil) to transfer data between the victim\'s cloud account and their own attacker-controlled cloud account in the same provider.',
          difficulty: 'Advanced',
          mitigations: [
            { id: 'M1057', name: 'Data Loss Prevention', description: 'Monitor CloudTrail / Azure Activity Logs for unexpected data copy operations or cross-account transfers. Set up GuardDuty for anomalous S3 activity.' },
            { id: 'M1037', name: 'Filter Network Traffic', description: 'Use SCPs (Service Control Policies) to prevent data transfer to external cloud accounts.' }
          ]
        },
        {
          id: 'T1029',
          name: 'Scheduled Transfer',
          description: 'Adversaries exfiltrate data in scheduled batches — at night, on weekends, or at regular intervals — to blend with business traffic patterns and reduce the chance of triggering volume-based DLP alerts.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1031', name: 'Network Intrusion Prevention', description: 'Monitor for scheduled outbound connections at unusual times. Baseline normal outbound traffic and alert on deviations.' }
          ]
        }
      ]
    },

    // ── 14. IMPACT ─────────────────────────────────────────────
    {
      id: 'TA0040',
      order: 14,
      name: 'Impact',
      shortDesc: 'Disrupt, destroy, or manipulate systems and data',
      description: 'The adversary carries out their ultimate objective: disrupting operations, destroying data, encrypting systems for ransom, or manipulating critical processes. Impact is the final, visible phase of an attack — this is when organizations "feel" the breach.',
      icon: '💥',
      color: '#ff0000',
      techniques: [
        {
          id: 'T1486',
          name: 'Data Encrypted for Impact (Ransomware)',
          description: 'Adversaries encrypt files across the organization using strong asymmetric encryption and demand ransom payment for the decryption key. Modern ransomware-as-a-service (RaaS) operations combine encryption with double extortion (also threatening to publish stolen data).',
          difficulty: 'Beginner',
          mitigations: [
            { id: 'M1053', name: 'Data Backup', description: 'Maintain multiple offline, immutable backups (3-2-1 rule: 3 copies, 2 media types, 1 offsite). Test restore procedures monthly — untested backups are not backups.' },
            { id: 'M1040', name: 'Behavior Prevention on Endpoint', description: 'EDR with behavioral detection can identify ransomware encryption patterns (mass file extension changes, deletion of shadow copies) and terminate the process.' }
          ]
        },
        {
          id: 'T1485',
          name: 'Data Destruction',
          description: 'Adversaries permanently delete or corrupt data using wiper malware (NotPetya, WhisperGate, CaddyWiper), overwriting MBR, deleting database contents, or running rm -rf commands to cause maximum disruption without a recovery path.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1053', name: 'Data Backup', description: 'Offline, air-gapped backups are the primary defense. Destruction malware cannot destroy what it cannot reach.' },
            { id: 'M1022', name: 'Restrict File and Directory Permissions', description: 'Least-privilege access prevents mass file deletion by a compromised standard user account.' }
          ]
        },
        {
          id: 'T1499',
          name: 'Endpoint Denial of Service',
          description: 'Adversaries exhaust endpoint resources — CPU, memory, disk, or network — through fork bombs, crypto mining, or targeted resource exhaustion to make systems unusable without destroying data.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1040', name: 'Behavior Prevention on Endpoint', description: 'Monitor for sudden CPU/memory spikes and abnormal process resource consumption. Resource limits (cgroups, Windows Job Objects) contain the blast radius.' }
          ]
        },
        {
          id: 'T1490',
          name: 'Inhibit System Recovery',
          description: 'Adversaries delete Volume Shadow Copies (vssadmin delete shadows), disable System Restore, remove backup agents, and wipe recovery partitions to prevent victims from recovering without paying ransom. Almost always precedes ransomware deployment.',
          difficulty: 'Intermediate',
          mitigations: [
            { id: 'M1053', name: 'Data Backup', description: 'Store backups in locations the malware cannot reach: offline tapes, cloud storage with immutable retention policies, or network storage with SMB disabled.' },
            { id: 'M1026', name: 'Privileged Account Management', description: 'Only backup administrators should be able to delete shadow copies. Monitor for vssadmin.exe and wmic shadowcopy delete commands.' }
          ]
        },
        {
          id: 'T1498',
          name: 'Network Denial of Service',
          description: 'Adversaries flood target networks or services with massive traffic volumes (DDoS) using botnets or amplification attacks (DNS, NTP, memcached) to disrupt availability for legitimate users.',
          difficulty: 'Beginner',
          mitigations: [
            { id: 'M1037', name: 'Filter Network Traffic', description: 'Deploy DDoS mitigation services (Cloudflare, AWS Shield, Akamai). Implement rate limiting and traffic scrubbing upstream of critical services.' },
            { id: 'M1035', name: 'Limit Access to Resource Over Network', description: 'Use BGP blackholing and CDN distribution to absorb volumetric DDoS attacks.' }
          ]
        }
      ]
    }

  ] // end tactics array

}; // end MITRE_DATA


// ============================================================
//  HELPER FUNCTIONS — utility accessors for the data
// ============================================================

/**
 * Returns a flat array of ALL techniques across all tactics.
 * Adds a tacticId and tacticName property to each technique object.
 */
function getAllTechniques() {
  const result = [];
  MITRE_DATA.tactics.forEach(tactic => {
    tactic.techniques.forEach(tech => {
      result.push({ ...tech, tacticId: tactic.id, tacticName: tactic.name });
    });
  });
  return result;
}

/**
 * Returns a flat array of ALL mitigations across all techniques.
 * Adds techniqueName and tacticName for context.
 */
function getAllMitigations() {
  const result = [];
  MITRE_DATA.tactics.forEach(tactic => {
    tactic.techniques.forEach(tech => {
      tech.mitigations.forEach(mit => {
        result.push({ ...mit, techniqueName: tech.name, techniqueId: tech.id, tacticName: tactic.name });
      });
    });
  });
  return result;
}

/**
 * Returns a random subset of the given array (Fisher-Yates shuffle + slice).
 * @param {Array} arr - Source array
 * @param {number} n   - Number of items to return
 */
function getRandomSubset(arr, n) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

/**
 * Shuffles an array in place using Fisher-Yates algorithm.
 * @param {Array} arr
 * @returns {Array} The same array, shuffled
 */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates 3 wrong answer choices from a pool, excluding the correct answer.
 * @param {Array} pool       - All possible choices
 * @param {*}    correct     - The correct answer (will be excluded from wrong answers)
 * @param {string} key       - Property name to compare (e.g., 'name', 'id')
 * @returns {Array} 3 wrong choices
 */
function getWrongChoices(pool, correct, key = 'name') {
  const others = pool.filter(item => item[key] !== correct[key]);
  return getRandomSubset(others, 3);
}
