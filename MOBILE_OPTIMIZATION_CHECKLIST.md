Fix mobile UI/UX issues without changing overall layout structure or theme.
🎯 OBJECTIVES
1️⃣ Onboarding Form Cleanup
Remove all default pre-filled values in dropdowns (MPC, BiPC, etc.).
Do NOT auto-select any option.
Every field must show placeholder text only until user selects.
Example: stream: "" (empty by default) strongSubjects: [] interests: []
Ensure form renders completely clean for every new signup.
If existing data exists in DB:
Only load it if onboardingCompleted == true.
Otherwise show empty clean form.
2️⃣ Mobile Font & Spacing Optimization
On screens below 768px:
Reduce form label font-size: from text-lg to text-base
Reduce input font-size: from text-base to text-sm
Reduce spacing: from gap-6 to gap-4
Reduce section padding: from p-6 to p-4
Apply responsive classes like:
Copy code

className="text-base md:text-lg"
className="p-4 md:p-6"
className="gap-4 md:gap-6"
Ensure mobile does not look oversized.
3️⃣ Fix “Generate AI Recommendation” Button Overflow
Problem: Button is partially outside viewport on mobile.
Fix:
Wrap buttons in responsive flex container:
Copy code

<div className="flex flex-col sm:flex-row gap-3 w-full">
Make buttons:
Copy code

className="w-full sm:w-auto"
Ensure:
No horizontal scroll.
No overflow hidden.
No fixed width.
No absolute positioning.
Add:
Copy code

max-w-full
overflow-hidden
to parent container if needed.
4️⃣ Fix Landing Page “Get Started” Button (Half Visible)
Root cause: Navbar content overflow or insufficient spacing.
Fix:
Header container must use:
Copy code

className="flex items-center justify-between px-4 sm:px-6 w-full"
Button:
Copy code

className="whitespace-nowrap px-4 py-2 text-sm sm:text-base"
Ensure no fixed width on header elements.
Also check:
Remove negative margins.
Remove absolute positioning if used.
Add responsive padding.
Ensure:
Button fully visible on all mobile widths.
No clipping.
No zoom required.
5️⃣ Global Mobile Safety Rules
Apply globally:
Add container wrapper:
Copy code

className="max-w-screen overflow-x-hidden"
Use:
Copy code

meta viewport width=device-width, initial-scale=1
Remove any fixed width like: width: 400px min-width: 500px
Replace with: w-full max-w-md max-w-screen-md
6️⃣ Final Mobile QA Checklist (Auto Validate)
After implementation:
✔ No horizontal scroll
✔ All buttons fully visible
✔ Fonts readable but not oversized
✔ No default values in onboarding
✔ Clean appearance for every new user
✔ Works in Chrome mobile emulator + real device
✔ No layout shift
7️⃣ Important
Do NOT:
Change theme
Change structure
Redesign layout
Modify desktop view
Only refine responsiveness and form cleanliness.
