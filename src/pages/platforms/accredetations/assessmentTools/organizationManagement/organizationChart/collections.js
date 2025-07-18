const sampleOrgData = {
  title: "Superadmin",
  name: "jhon carl Kevin Magtalas",
  id: "01",
  children: [
    {
      title: "Manager",
      name: "Jason Reyes",
      id: "02-01",
      children: [
        {
          title: "Laboratory",
          name: "Alyssa Cruz",
          id: "02-01-01",
          children: [
            { title: "Laboratory", name: "Karl Santos", id: "02-01-01-01" },
            { title: "Laboratory", name: "Mia Villanueva", id: "02-01-01-02" },
          ],
        },
        { title: "Clinical", name: "Jared Lim", id: "02-01-02" },
        { title: "Clinical", name: "Nica Dominguez", id: "02-01-03" },
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
        { title: "Clinical", name: "Nica Dominguez" },
        {
          title: "Cashier",
          name: "Ricky Tolentino",
          children: [{ title: "Clinical", name: "Nica Dominguez" }],
        },
        {
          title: "Cashier",
          name: "Grace Bautista",
          children: [{ title: "Accreditation", name: "Dino Evangelista" }],
        },
      ],
    },
    {
      title: "Frontdesk",
      name: "Nerissa Tan",
      id: "02-02",
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
  ],
};

export default sampleOrgData;
