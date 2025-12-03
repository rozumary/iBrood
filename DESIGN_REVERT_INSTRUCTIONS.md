# iBrood Design Theme Revert Instructions
## Created: December 3, 2025

If you want to revert to the original design, follow these steps:

## Option 1: Quick Revert (CSS Only)
1. Copy the contents of `app/globals.backup.css` to `app/globals.css`
2. Restart the development server (`npm run dev`)

## Option 2: Full Revert (Git)
If you have committed before the changes, run:
```powershell
git checkout HEAD~1 -- app/globals.css components/ui/button.tsx components/ui/card.tsx components/navigation.tsx components/footer.tsx components/auth-navigation.tsx components/image-uploader.tsx app/page.tsx app/login/page.tsx app/signup/page.tsx app/dashboard/page.tsx app/queen-cell/page.tsx app/brood-pattern/page.tsx tailwind.config.ts
```

## Option 3: Selective Revert
You can revert specific files by copying the backup content manually:

### Files Changed:
- `app/globals.css` - Main theme colors (backup: `app/globals.backup.css`)
- `components/ui/button.tsx` - Button styles with gradients
- `components/ui/card.tsx` - Card component styling
- `components/navigation.tsx` - Navigation bar with bee theme
- `components/footer.tsx` - Footer without developer name
- `components/auth-navigation.tsx` - Auth pages navigation
- `components/image-uploader.tsx` - Upload cards styling
- `app/page.tsx` - Landing page design
- `app/login/page.tsx` - Login page design
- `app/signup/page.tsx` - Signup page design  
- `app/dashboard/page.tsx` - Dashboard page design
- `app/queen-cell/page.tsx` - Queen cell analysis page
- `app/brood-pattern/page.tsx` - Brood pattern page
- `tailwind.config.ts` - Added honey colors & wider containers

## What Changed in the New Design:
1. **Color Theme**: Yellow/Orange "Bee Theme" with amber and orange gradients
2. **Buttons**: Changed from red to orange, added gradient effects and hover animations
3. **Cards**: Added subtle gradients, rounded corners (2xl), shadow effects
4. **Navigation**: Gradient background, enhanced logo, improved hover states
5. **Footer**: Removed "Developer: Rosemarie Montesa", added bee emoji branding
6. **Icons**: Modernized with larger sizes, gradient backgrounds on hover
7. **Containers**: Wider max-width, responsive padding
8. **Hover Effects**: Added lift animations (-translate-y), shadow transitions
9. **Typography**: Added gradient text for headings
10. **Overall**: Warm honeycomb-inspired aesthetic throughout

## Keep the backup file (`globals.backup.css`) safe for easy reverting!
