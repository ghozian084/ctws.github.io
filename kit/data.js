/**
 * Ghozi Learning Kit — content map
 * -----------------------------------------------------------------------
 * This file is the single source of truth for the menu and the router.
 * To add content: drop the .html file in the matching dm/g{grade}/{topic}
 * folder, then add one line below. No other code needs to change.
 *
 * Section keys (fixed, in teaching order):
 *   lp = Lesson Plan        (always exactly one file, no index)
 *   bd = Board               (1 or more files)
 *   im = Interactive Media   (1 or more files)
 *   ws = Worksheet           (1 or more files)
 *   ha = Hands-on Activity   (1 or more files)
 */

const LEARNING_KIT_DATA = {
  kitTitle: "Mr. Ghozi Learning Kit",
  grades: [
    {
      grade: 9,
      folder: "g09",
      label: "Grade 9",
      topics: [
        {
          id: 1,
          slug: "t01-review-number-concept",
          title: "Review of Number Concept",
          sections: {
            lp: { label: "Lesson Plan", files: [{ file: "lp.html", title: "Lesson Plan" }] },
            bd: { label: "Board", files: [{ index: 1, file: "bd-01.html", title: "Board 1" }] },
            im: { label: "Interactive Media", files: [{ index: 1, file: "im-01.html", title: "Interactive Media 1" }] },
            ws: {
              label: "Worksheet",
              files: [
                { index: 1, file: "ws-01.html", title: "Worksheet 1" },
                { index: 2, file: "ws-02.html", title: "Worksheet 2" },
              ],
            },
            ha: { label: "Hands-on Activity", files: [{ index: 1, file: "ha-01.html", title: "Hands-on Activity 1" }] },
          },
        },
        {
          id: 2,
          slug: "t02-making-sense-of-algebra",
          title: "Making Sense of Algebra",
          sections: {
            lp: { label: "Lesson Plan", files: [{ file: "lp.html", title: "Lesson Plan" }] },
          },
        },
        {
          id: 3,
          slug: "t03-lines-angles-and-shapes",
          title: "Lines, Angles and Shapes",
          sections: {
            lp: { label: "Lesson Plan", files: [{ file: "lp.html", title: "Lesson Plan" }] },
          },
        },
        {
          id: 4,
          slug: "t04-collecting-organising-and-displaying-data",
          title: "Collecting, Organising and Displaying Data",
          sections: {
            lp: { label: "Lesson Plan", files: [{ file: "lp.html", title: "Lesson Plan" }] },
          },
        },
        {
          id: 5,
          slug: "t05-fractions-percentages-and-standard-form",
          title: "Fractions, Percentages and Standard Form",
          sections: {
            lp: { label: "Lesson Plan", files: [{ file: "lp.html", title: "Lesson Plan" }] },
          },
        },
        {
          id: 6,
          slug: "t06-equations-factors-and-formulae",
          title: "Equations, Factors and Formulae",
          sections: {
            lp: { label: "Lesson Plan", files: [{ file: "lp.html", title: "Lesson Plan" }] },
          },
        },
      ],
    },
    {
      grade: 12,
      folder: "g12",
      label: "Grade 12",
      topics: [
        {
          id: 1,
          slug: "t01-permutation-combination",
          title: "Permutation & Combination",
          sections: {
            lp: { label: "Lesson Plan", files: [{ file: "lp.html", title: "Lesson Plan" }] },
            bd: { label: "Board", files: [{ index: 1, file: "bd-01.html", title: "Board 1" }] },
            im: { label: "Interactive Media", files: [{ index: 1, file: "im-01.html", title: "Interactive Media 1" }] },
            ws: { label: "Worksheet", files: [{ index: 1, file: "ws-01.html", title: "Worksheet 1" }] },
            ha: { label: "Hands-on Activity", files: [{ index: 1, file: "ha-01.html", title: "Hands-on Activity 1" }] },
          },
        },
      ],
    },
  ],
};
