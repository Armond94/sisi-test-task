# Bulk File Upload

**SiSi Sample Task**

**Expected Time**: ~3–4 hours
**Stack**: React + Typescript
**Focus**: Design fidelity, state modeling, correctness, judgement

## Context

SiSi is an all-in-one platform for schools. Schools often upload large batches of files (reports, documents, records) that need to be matched to the correct student before confirming the upload.

## Your Task

Implement the **file mapping flow** shown in the provided design.

This is a single screen/flow, not a full app. You do not need to consider any other aspect of the app such as other pages or authentication.

## What to Build

An interface with a bulk file upload input that then takes each file uploaded and maps to an existing student record. After uploading:

- Render a list of the uploaded files
- For each file, show a "Mapped To" control
  - With three possible states:
    - Matched
    - No Match Found
    - Multiple Potential Matches
  - For all offer a select input with students presented as options allowing the user to set or modify the mapped student
- A "Confirm & Upload" button

For the mapping logic, the user should be able to select the field that is being mapped to out of the following options:

- "Portal ID" (`id` field)
- "Name" (`name` field)
- "Student ID" (`studentID` field)

Based on the field selection, the files should then map to students based on the name of each file. At minimum the matching logic should handle cases where the file name is exactly the value of a field (excluding the file extension) (e.g. `12345.pdf` maps to student with `id` `12345`). Better is for the matching logic to handle cases where the file name includes additional text (e.g. `12345 transcript.pdf` maps to student with `id` `12345`).

**Note**: You do not need to keep anything about the files other than what is required for the UI. The file data can be discarded and does not actually need to be stored or uploaded anywhere. Alternatively, in the interest of time, the file upload can be mocked and just clicked on to activate, however this should include multiple and varied file names and types (a good test set).

## Resources

- Figma: https://www.figma.com/design/3EvD7el08Pxw8igHVjEGR1/SiSi-Dev-Challenge
- Icon library: Lucide (https://lucide.dev) (npm: https://www.npmjs.com/package/lucide-react)

## Design Requirements

- Try to match the provided design **as closely as possible**
- Pixel perfection is **not** required, but layout and intent should be clear
- You may use any styling approach you wish (e.g. Plain CSS, CSS Modules, CSS-in-JS via the `style` prop, Tailwind). You may also use any UI libraries you like.
- Assume up to a few hundred files; keep the UI responsive

## Project Scaffold

The initial template for the project has been created for you using Vite (use `npm run dev` to start). Of particular importance are the files:

- `theme.css`: Theme file defining CSS custom properties (not all contents are relevant)
- `students.ts`: The mock database/API that contains the list of existing students
- `submit.ts`: Contains the final submit API call describing the data needed

You may import any external libraries you want including both UI/functional and dev tools.

## What We Care About

We will evaluate:

- **Design fidelity**
  - Can you translate a real design into a working UI
- **State modeling**
  - Is the mapping logic clear, intentional, and easy to reason about?
- **Correctness**
  - Do interactions behave consistently?
- **Judgement**
  - Did you scope appropriately for the timebox?
- **Clarity**
  - Would another engineer understand this quickly?

## Deliverables

1. The code (via either a GitHub repo or zip)
2. A short `NOTES.md` file answering:
   - What did you prioritize? What part are you most proud of?
   - What did you intentionally leave out?
   - What would you improve with more time?
   - What questions did you have, how did you resolve them, and why did you make the decisions that you did?

## Notes

- Please do not spend more than ~3–4 hours
- We value decision quality over completeness
- This exercise reflects real work at SiSi
- Please contact me at henry@sisi.org.uk with any questions
