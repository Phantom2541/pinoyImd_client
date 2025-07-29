export const instructionSteps = [
  {
    title: "Step 1: View Card 1",
    description: "This is Card 1 with an image and buttons.",
    target: ".template1-card",
  },
  {
    title: "Step 1.5: View Card 1",
    description: "Click this button.",
    target: "#template1-card-btn",
    required: true, // <--- ito ang bago
    requiredType: "click", // o "click"
    requiredMessage: "You need to click the Submit button before continuing.",
  },
  {
    title: "Step 2: View Card 3",
    description: "Text-only card for announcements or notices.",
    target: ".template3-card",
  },
  {
    title: "Step 3: View Card 5",
    description: "This shows the system update message.",
    target: ".template5-card",
  },
  {
    title: "Step 3.5: View Card 5",
    description: "This shows the system update message.",
    target: "#template5-card-input",
    required: true, // <--- ito ang bago
    requiredType: "input",
    requiredMessage: "fill up this input before continuing.",
  },

  {
    title: "Step 4: View Card 4",
    description: "This shows an additional system update card.",
    target: ".template4-card",
  },
  {
    title: "Step 5: Open Platforms Dropdown",
    description: "Click to view available platforms.",
    target: "#platforms-dropdown",
  },
  {
    title: "Step 6: Platforms Dropdown Menu",
    description: "Shows the list of available platforms.",
    target: "#platforms-dropdown-menu",
  },
  {
    title: "Step 7: Sidebar Link",
    description: "Navigate using this sidebar link.",
    target: "#sidebar-link",
  },
];
