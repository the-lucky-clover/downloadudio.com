# Setting Up downloadudio.com on Cloudflare Pages

## Prerequisites
- Domain registered: downloadudio.com
- Cloudflare Pages project deployed
- Access to your domain registrar

## Option 1: Domain Already on Cloudflare (Recommended)

### Step 1: Transfer Domain to Cloudflare
1. Go to [Cloudflare Domain Registration](https://dash.cloudflare.com/domains)
2. Search for "downloadudio.com"
3. Transfer domain to Cloudflare (or register if available)
4. Complete the transfer process

### Step 2: Connect to Pages Project
1. Go to your Cloudflare Pages project: https://dash.cloudflare.com/955eed3d47451a38b3e8311ffe6bad55/pages/view/downloadudio
2. Click **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter: `downloadudio.com`
5. Click **Continue**
6. Cloudflare will automatically configure DNS records
7. Also add `www.downloadudio.com` as an alias

### Step 3: Verify (5-10 minutes)
- Visit https://downloadudio.com
- SSL certificate will be automatically provisioned

## Option 2: Domain on Another Registrar

### Step 1: Get Cloudflare Nameservers
1. Add downloadudio.com to Cloudflare (free plan)
2. Go to: https://dash.cloudflare.com/955eed3d47451a38b3e8311ffe6bad55
3. Click **Add a site**
4. Enter: `downloadudio.com`
5. Select **Free** plan
6. Cloudflare will provide nameservers (e.g., `alice.ns.cloudflare.com`, `bob.ns.cloudflare.com`)

### Step 2: Update Nameservers at Registrar
1. Log in to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find DNS/Nameserver settings
3. Replace existing nameservers with Cloudflare's
4. Save changes (propagation takes 24-48 hours, usually faster)

### Step 3: Configure DNS in Cloudflare
1. In Cloudflare dashboard, go to **DNS** > **Records**
2. Cloudflare Pages will automatically create CNAME records when you add the custom domain

### Step 4: Add Domain to Pages
1. Go to: https://dash.cloudflare.com/955eed3d47451a38b3e8311ffe6bad55/pages/view/downloadudio
2. Click **Custom domains**
3. Click **Set up a custom domain**
4. Enter: `downloadudio.com`
5. Cloudflare will create a CNAME record automatically
6. Add `www.downloadudio.com` as well

### Step 5: Verify
- Wait for DNS propagation (usually 10-30 minutes)
- Visit https://downloadudio.com
- SSL certificate auto-provisioned by Cloudflare

## Option 3: Manual DNS Setup (If Not Using Cloudflare DNS)

### Configure at Your DNS Provider
Add these DNS records at your current DNS provider:

```
Type    Name    Value                                   TTL
CNAME   @       downloadudio.pages.dev                  Auto
CNAME   www     downloadudio.pages.dev                  Auto
```

**Note**: Some providers don't allow CNAME at root. Use A records instead:

```
Type    Name    Value
A       @       (Get IP from Cloudflare Pages dashboard)
AAAA    @       (Get IPv6 from Cloudflare Pages dashboard)
CNAME   www     downloadudio.pages.dev
```

Then add domain in Cloudflare Pages dashboard.

## Post-Setup Configuration

### 1. Redirect www to Root (or vice versa)
In Cloudflare Pages dashboard:
1. Go to **Custom domains**
2. Set primary domain to `downloadudio.com`
3. `www.downloadudio.com` will auto-redirect

### 2. Force HTTPS
Cloudflare automatically forces HTTPS. To verify:
1. Go to **SSL/TLS** in Cloudflare dashboard
2. Ensure **Full** or **Full (strict)** is selected
3. Enable **Always Use HTTPS**

### 3. Update Environment Variables
Update any hardcoded URLs in your app:
- Update `index.html` meta tags
- Update `.env` if you have one
- Update any API endpoints

### 4. Update DNS Records for Email (Optional)
If you want email@downloadudio.com:
1. Add MX records from your email provider
2. Add SPF, DKIM records for deliverability

## Verification Commands

### Check DNS Propagation
```bash
# Check nameservers
dig downloadudio.com NS +short

# Check A record
dig downloadudio.com +short

# Check CNAME
dig www.downloadudio.com +short
```

### Test SSL Certificate
```bash
curl -I https://downloadudio.com
```

## Troubleshooting

### Domain Not Resolving
- Wait 24-48 hours for DNS propagation
- Clear DNS cache: `sudo dscacheutil -flushcache` (macOS)
- Check nameservers: `whois downloadudio.com`

### SSL Certificate Error
- Cloudflare auto-provisions SSL (takes 5-10 minutes)
- Ensure DNS is pointing to Cloudflare
- Check SSL/TLS settings in Cloudflare dashboard

### "Too Many Redirects" Error
- Change SSL/TLS mode to **Full** or **Full (strict)**
- Disable any redirect loops in your app

## Quick Setup Summary

**If domain is on Cloudflare:**
1. Pages dashboard → Custom domains → Add `downloadudio.com`
2. Done! (Auto-configured)

**If domain is elsewhere:**
1. Add site to Cloudflare
2. Update nameservers at registrar
3. Pages dashboard → Custom domains → Add `downloadudio.com`
4. Wait for DNS propagation

## Cloudflare Pages Dashboard Links

- **Project**: https://dash.cloudflare.com/955eed3d47451a38b3e8311ffe6bad55/pages/view/downloadudio
- **Custom Domains**: https://dash.cloudflare.com/955eed3d47451a38b3e8311ffe6bad55/pages/view/downloadudio/domains
- **DNS Settings**: https://dash.cloudflare.com/955eed3d47451a38b3e8311ffe6bad55/downloadudio.com/dns

## Estimated Timeline

- Nameserver change: 24-48 hours (usually 1-4 hours)
- DNS record update: 5-30 minutes
- SSL certificate: 5-10 minutes
- **Total**: ~30 minutes if domain already on Cloudflare, ~2-4 hours if transferring

---

**Need help?** Check Cloudflare docs: https://developers.cloudflare.com/pages/how-to/custom-domain/
