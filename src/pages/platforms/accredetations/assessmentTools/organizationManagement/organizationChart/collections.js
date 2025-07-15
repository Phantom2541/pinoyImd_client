const sampleOrgData = {
  title: "Superadmin",
  name: "Kevin Magtalas",
  children: [
    {
      title: "Manager",
      name: "Jason Reyes",
      children: [
        {
          title: "Laboratory",
          name: "Alyssa Cruz",
          children: [
            { title: "Laboratory", name: "Karl Santos" },
            { title: "Laboratory", name: "Mia Villanueva" },
          ],
        },
        { title: "Clinical", name: "Jared Lim" },
        { title: "Clinical", name: "Nica Dominguez" },
      ],
    },
    {
      title: "Cashier",
      name: "Angela Robles",
      children: [
        {
          title: "Accreditation",
          name: "Marco Dela Peña",
          children: [
            { title: "Accreditation", name: "Irene Fajardo" },
            { title: "Accreditation", name: "Dino Evangelista" },
          ],
        },
        { title: "Cashier", name: "Ricky Tolentino" },
        { title: "Cashier", name: "Grace Bautista" },
      ],
    },
    {
      title: "Frontdesk",
      name: "Nerissa Tan",
      children: [
        {
          title: "Frontdesk",
          name: "Leo Gutierrez",
          children: [
            {
              title: "Accreditation",
              name: "Dino Evangelista",
              children: [{ title: "Laboratory", name: "Mia Villanueva" }],
            },
          ],
        },
        {
          title: "Frontdesk",
          name: "Pauline Ortega",
          children: [
            { title: "manager", name: "kevin magtalas" },
            { title: "patron", name: "carl magtalas" },
          ],
        },
      ],
    },
    {
      title: "Physician",
      name: "Miguel Soriano",
      children: [
        {
          title: "Physician",
          name: "Ella Fernandez",
          children: [
            {
              title: "Physician",
              name: "Benjie Ramos",
              children: [{ title: "Frontdesk", name: "Pauline Ortega" }],
            },
            { title: "Physician", name: "Trina Sevilla" },
          ],
        },
        { title: "Patron", name: "Carmela Mendoza" },
      ],
    },
  ],
};

export default sampleOrgData;
