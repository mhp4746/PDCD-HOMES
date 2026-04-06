import { useState } from "react";

const BLUE = "#38BDF8";
const BLUE_DARK = "#0C4A6E";
const BLUE_MID = "#0369A1";
const ORANGE = "#E97132";
const ORANGE_LIGHT = "#FEF3EB";
const ORANGE_DARK = "#C2571D";
const BG = "#F0F7FB";
const WHITE = "#FFFFFF";
const BORDER = "#D6E8F0";
const TEXT = "#1E293B";
const TEXT_MID = "#475569";
const TEXT_MUTED = "#94A3B8";
const GREEN = "#22C55E";
const GREEN_BG = "#DCFCE7";
const YELLOW_BG = "#FEF9C3";
const RED = "#EF4444";

const STAGES = [
  {
    id: "preliminary", name: "Preliminary", color: "#0369A1",
    tasks: [
      { name: "Documents Received from Client", duration: "2d" },
      { name: "Preliminary Agreement", duration: "1d" },
      { name: "DoC Sign (Preliminary Agreement)", duration: "1d" },
      { name: "Invoice Raise & Job Create in BEAMS", duration: "1d" },
      { name: "Feature Survey", duration: "3d" },
      { name: "Concept", duration: "5d" },
      { name: "Estimation", duration: "5d" },
      { name: "Construction Price Proposal Accepted", duration: "3d" },
      { name: "HIA Contract and Addenda Sent", duration: "2d" },
      { name: "DoC Sign (HIA Contract & Addenda)", duration: "1d" },
      { name: "DA Drawings (If required)", duration: "5d" },
      { name: "BAL Report (if applicable)", duration: "3d" },
      { name: "Geotech Report & Stormwater Plan", duration: "5d" },
      { name: "Working Drawings", duration: "7d" },
      { name: "CDC & Engineering", duration: "5d" },
      { name: "Insurance", duration: "2d" },
      { name: "Building Permit Application Submitted", duration: "1d" },
      { name: "Permit Received & Mail to Client", duration: "14d" },
      { name: "💰 Deposit Claim", duration: "1d", isClaim: true },
      { name: "BEAMS Entry", duration: "1d" },
    ]
  },
  {
    id: "prework", name: "1_Construction Pre-Work", color: "#7C3AED",
    tasks: [
      { name: "Quotation Stage 1 — Site, Concrete, Surveyor, Plumber, Electrician, Pest, Bricks, Window, Roof", duration: "5d" },
      { name: "Selection Stage 1 — Brick, Window Colour, Roof Colour", duration: "5d" },
      { name: "Site Work", duration: "3d" },
      { name: "House Set Out — Surveyor", duration: "1d" },
    ]
  },
  {
    id: "slab", name: "2_Slab Stage", color: "#D97706",
    tasks: [
      { name: "Call Up & Booking — Bricky, Roof Chippie", duration: "1d" },
      { name: "Footing Mark Out", duration: "1d" },
      { name: "Plumbing Pre-Lay", duration: "2d" },
      { name: "Footing (Concrete Pour)", duration: "1d" },
      { name: "Pest Control Treatment", duration: "1d" },
      { name: "Slab Pouring", duration: "1d" },
      { name: "💰 Slab Down Claim — Milestone 1", duration: "1d", isClaim: true },
      { name: "Slab Curing (if required)", duration: "7d" },
      { name: "Slab Perging", duration: "1d" },
      { name: "Delivery Material — SockWell", duration: "1d" },
      { name: "Sockwell and Drainage", duration: "3d" },
      { name: "Slab Cleaning", duration: "1d" },
      { name: "Delivery Materials 1 — Bricks, Lintels, Frames, Windows, Hardware, Sand", duration: "1d" },
      { name: "Skip Bin (if required)", duration: "1d" },
    ]
  },
  {
    id: "brick", name: "3_Brick Work", color: "#DC2626",
    tasks: [
      { name: "Selection Stage 2 — Tapware, Sanitaryware, Doors, Locks, Kitchen, Blinds, Garage, Paints", duration: "5d" },
      { name: "Brick Work", duration: "10d" },
      { name: "Due Selection 1 — Bathtub, Basin, Sink, Taps, Shower Rails, AC, Toilet, Doors, Ceiling", duration: "3d" },
      { name: "D-Call Up & Booking Stage 1 — Roof Chippie, Crane, Welder, Roof Cover", duration: "1d" },
      { name: "Bricky T-Bar Work", duration: "2d" },
      { name: "💰 Plate Height Claim — Milestone 2", duration: "1d", isClaim: true },
      { name: "Delivery Materials — Timber", duration: "1d" },
      { name: "Site Clean (if required)", duration: "1d" },
    ]
  },
  {
    id: "roof", name: "4_Roof Cover", color: "#059669",
    tasks: [
      { name: "Roof Chippie", duration: "5d" },
      { name: "Due Selection 2 — Colour Selection, Appliances", duration: "3d" },
      { name: "Welder for Tie-Rod and Bracket", duration: "2d" },
      { name: "Roof Measurements", duration: "1d" },
      { name: "D-Call Up & Booking Stage 2 — Plumber, Electrician, Float, Window, Carpenter, Gas", duration: "1d" },
      { name: "Delivery Materials — Roof Sheet", duration: "1d" },
      { name: "Quotation Stage 2 — Roof, Plaster, Painting, Ceiling, AC, Doors, Kitchen, Tapware", duration: "3d" },
      { name: "Due Selection 3 — Kitchen Cabinet, Garage Door, Blinds, Shower Screen", duration: "3d" },
      { name: "Gutter Installation (Roof Plumber)", duration: "2d" },
      { name: "Roof Cover", duration: "3d" },
      { name: "Y-Call Up Stage 1 — Ceiling, Painter, Electric Precut, Carpenter", duration: "1d" },
      { name: "💰 Roof Cover Claim — Milestone 3", duration: "1d", isClaim: true },
      { name: "Electric Tubing", duration: "2d" },
      { name: "Plumbing Tubing", duration: "2d" },
      { name: "Delivery Materials — Plaster Sand", duration: "1d" },
      { name: "Float and SAT", duration: "2d" },
    ]
  },
  {
    id: "lockup", name: "5_Lock Up Stage", color: "#2563EB",
    tasks: [
      { name: "Window Glazing", duration: "2d" },
      { name: "Delivery Materials — Door", duration: "1d" },
      { name: "Fixing Carpenter for Lock Up", duration: "3d" },
      { name: "Ceiling Installation", duration: "3d" },
      { name: "Site Clean (if required)", duration: "1d" },
      { name: "Y-Call Up Stage 2 — Plumber Drainage, Garage Grano, Kitchen, Tiler", duration: "1d" },
      { name: "Quotation Stage 3 — Blinds, Flooring, Carpet, Tiles, Shower Screen, Paving, Garage Door", duration: "3d" },
      { name: "💰 Lock Up Claim — Milestone 4", duration: "1d", isClaim: true },
    ]
  },
  {
    id: "pci", name: "6_Practical Completion (PCI)", color: "#DB2777",
    tasks: [
      { name: "Electric Pre-Cut", duration: "1d" },
      { name: "Due Selection 4 — Driveway, Landscaping", duration: "3d" },
      { name: "Painting — Ceiling, Door Primer, Eves", duration: "5d" },
      { name: "Delivery — Bathtub, Basin, Sink & Sand", duration: "1d" },
      { name: "Drain Check and Bathtub Installation", duration: "2d" },
      { name: "Garage Grano & AC Outdoor Slab", duration: "2d" },
      { name: "Gas Meter Installation Booking", duration: "1d" },
      { name: "Garage Door Measurements", duration: "1d" },
      { name: "Delivery Materials 2 — Waterproofing, Rangehood, Oven, Cooktop", duration: "1d" },
      { name: "Waterproofing and Screeding", duration: "3d" },
      { name: "Cabinet Installation", duration: "3d" },
      { name: "Stone Measurement", duration: "1d" },
      { name: "Stone Installation", duration: "2d" },
      { name: "Delivery — Tiles, Glue, Trim & Floor Waste", duration: "1d" },
      { name: "Blinds Measurements", duration: "1d" },
      { name: "Y-Call Up Stage 3 — Shower, Plumbing, Electric, Insulation, AC, Blinds, Fly Screen", duration: "1d" },
      { name: "Tile Installation (Wet Area)", duration: "3d" },
      { name: "Delivery Materials 3 — Shelving, Toilet, Basin, Taps, Locks", duration: "1d" },
      { name: "Shower Screen, Mirror & Robs Installation", duration: "2d" },
      { name: "Plumbing Final", duration: "2d" },
      { name: "Electric Final", duration: "2d" },
      { name: "Y-Call Up Stage 4 — Painting Final, Cleaning, Fixing Carpenter", duration: "1d" },
      { name: "Locks, Handle, Toilet Rail & Towel Rail", duration: "1d" },
      { name: "Ceiling Insulation Installation", duration: "2d" },
      { name: "AC Ducting Installation", duration: "2d" },
      { name: "AC Final", duration: "1d" },
      { name: "Tile Installation (Main Floor)", duration: "3d" },
      { name: "Painting Finals", duration: "3d" },
      { name: "Blind Installation", duration: "1d" },
      { name: "Fly Screen Installation", duration: "1d" },
      { name: "Cleaning", duration: "2d" },
      { name: "Final Inspection", duration: "1d" },
      { name: "PCI for Client", duration: "1d" },
      { name: "Snag List Rectifier", duration: "5d" },
    ]
  },
  {
    id: "handover", name: "7_Handover", color: "#0D9488",
    tasks: [
      { name: "Handover Documents Preparation", duration: "3d" },
      { name: "Keys (Window, Doors, Garage Door)", duration: "1d" },
      { name: "Appliances Warranty/Guarantee Documents", duration: "1d" },
      { name: "Extra Material Handling — Pavers, Tiles, Paints", duration: "1d" },
      { name: "💰 PCI & Variation Claim — Milestone 5", duration: "1d", isClaim: true },
      { name: "Gifts Organize for Client", duration: "1d" },
      { name: "Organize Photos and Videos", duration: "2d" },
    ]
  }
];

const INITIAL_SITES = [
  { id: 1, name: "231, Strawberry Rise, Landsdale", client: "Thompson Family", start: "21/11/2024", finish: "07/05/2025", budget: "$385,000" },
  { id: 2, name: "45, Ocean View Dr, The Entrance", client: "Patel Family", start: "15/01/2025", finish: "12/08/2025", budget: "$420,000" },
  { id: 3, name: "12, Morrison Rd, Bateau Bay", client: "Williams Family", start: "03/02/2025", finish: "28/09/2025", budget: "$395,000" },
];

function initTasks(sites) {
  const s = {};
  sites.forEach(site => {
    s[site.id] = {};
    STAGES.forEach(stage => {
      s[site.id][stage.id] = {};
      stage.tasks.forEach((_, i) => s[site.id][stage.id][i] = false);
    });
  });
  // Demo
  STAGES.slice(0,3).forEach(st => st.tasks.forEach((_,i) => s[1][st.id][i] = true));
  [0,1,2,3,4].forEach(i => s[1]["brick"][i] = true);
  STAGES.slice(0,2).forEach(st => st.tasks.forEach((_,i) => s[2][st.id][i] = true));
  [0,1,2,3].forEach(i => s[2]["slab"][i] = true);
  [0,1,2,3,4,5,6,7,8,9].forEach(i => s[3]["preliminary"][i] = true);
  return s;
}

function stageProgress(state, siteId, stageId) {
  const st = STAGES.find(s => s.id === stageId);
  if (!st || !state[siteId]?.[stageId]) return 0;
  let d = 0;
  st.tasks.forEach((_, i) => { if (state[siteId][stageId][i]) d++; });
  return Math.round((d / st.tasks.length) * 100);
}

function siteProgress(state, siteId) {
  let t = 0, d = 0;
  STAGES.forEach(st => { t += st.tasks.length; st.tasks.forEach((_, i) => { if (state[siteId]?.[st.id]?.[i]) d++; }); });
  return t > 0 ? Math.round((d / t) * 100) : 0;
}

function currentStage(state, siteId) {
  for (const st of STAGES) { if (stageProgress(state, siteId, st.id) < 100) return st; }
  return STAGES[STAGES.length - 1];
}

function totalTasks() {
  return STAGES.reduce((a, s) => a + s.tasks.length, 0);
}

const LOGO_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAIAAAABc2X6AAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAAjWUlEQVR42r18eYCdZXX3Oed53u3us89kJslkhYQEDCSENYAWgYrKVlzKJ/YTxGpdqi3VKtrWr9aquKDQooKUD1QKiAGRXcIiEBYTSEhCSMieyax37fpuz/Oc7413ZjIz2SH97l8zc+fe9/09Zz+/c16Eo/RCAEIAAM1jf6PpeTmvSc5vkrMbRGeGWlOYs8GVKBAAUDMHissR9Pu8s6I3D6t1g7x+MN5aUsAm+QqBAACGgY/efR4dqGM4C65cOsU+s8ta0iZn5KngsI3AAJpZGzAMZty9EwIhCAKBiAixwWLI28r8Sq96akf8Qk9U9NUY8qMCG48WVEF01jT34jn2OV1yagYlcag41KAMmNHLIE6+ZAKAeeRnApAEjgBboGbcWeOnd6p734xWbA+UNkcF9tsHLEahZh15+THeFfPtE5pJEtdjDjUwAyEgHvEFGIAZmAEQHAEpiQpwzYC5c31014Z6KdDjL/3/CXACwzB4Ul65MHX1QntuA4bK1GNgBqKjYSej4A0DAqckupLeLPHP14S/WFOvx5pGbft/HPDo6eIHZqeuPdl7VwvWI1NXI9b4P/RKLN+TkLZwzRB850X/vo11AH4bosa3YbFdWfubZ2YuniWUNtUYBI4Y59u66BHcLzNohrQFtqTlm/XXnq1tL4VHatXi8NUYAAzARXMzt/95ZmkbDodGGRR0KLSIQAJRICIAAjCwATCJtQIiICERojjksSECIcQGgtgsaqFL5ro9dXp9IEokwUcRMGHihMS/nJn/9hmORFOJQBIe7A6RUAgEABVxWDVBzcQBsGGSIB2QLggbULBRHPkmqHJYAx0hIgoLhTiI8BGBEGsxpKW5dK5dcO0VOyLNfJiY8TCNtuBaN5+Xe383DfgaAA9srohEwGzCmokDtjxqnGp1Hmd1LZDtc0RDl8g0opNGIQEAtNJhlatDamhnvGdjvHOt2r2eB3eACsl2yEkBIBt9EMNm5uYUPbKNr3qkNOSrwzFpPBy0U7LWLy8snNTCAz5bdODvEpJ1rOtlTZbsOt49/jzvuPfYUxfKXAOOs0Mw45VnryIzgyoPRTte89c+Hqx5RO9cS6xFKockDgI7NtDswauD+NHflbeXokNixoNrsmGYlrPv+WB+boGLwQHRIgk2Jq4OazfnLnpf9oyPpY45Q7guAHCsWcfAo9nHCD7cq7Q8kn0AEgoLLQEA2vfrG56uPnN78OrvKapamQIiHQi2MpB3YGuFLru/srkYHBwzHhxtR9b+7UX5uXlTCkHSgYKyULVSBDJ1yuWF8z/vzTgeAUwYgVEACEhH4MQ5cWkMZJFjMYC/eVXx4R8FL95toZapArAePaDJmHM2bK3SB+8r7ShHyc0fAWBEAIasI5dfXFjUwsPBgdAKo1VQKcpjz266/JvZeacDgwl8AAAS7zj4agAg1wOE6tqn+u++Tm981s01EImx0mJfOb8+hB+4r1T0YzwAZnHAugfp1gvy53ThUADWAdBGftXXmL/sXzquuslt6za+z1oDCUA6GnUNARKrmOPY6ZydO/0vtXQqrz9FWgnb2VfOhFBXMDOH81vs32wMD+Tk9wNYEGjG607PX3Wc7N+/l2JGGZSLqmnmlM//uunMD3McmzhGEkeaghxeHksmjhApt/Aca85ppTUrTKlXOGkEs6+Lrca8qEXYlnxiWyhoP+ov9uuWz5+Z+v7ZbjEw+9Vkg7I2PIBzz55+7fL0tPmqXkcS+A6kmviYg5wVIgGwiaJU55z0kotKG1fGu9+QXnrf0CsQqxGfPdVaN4TrByOxz3+IyQkGQGva+uX7cjYZzZNvgpkNylpxwF70we6/u9tKFXTgjwTVd5An2xYJAm344KkMEpkotHPNuVMvK295Ndz2muVlcG/1Of47eVmX9ZtNcSU0kxISsY9nxu+dkz+zE8sRCJqsyBplrdhvLfpg9xd/TWSZOHonaJNK0LJp+bbKUKi7G1ytGA5aUSKRUZGw3fzSS4c3/ynavsbyMpOkiAiRhlYP2zP28k3BAQEnyvzu7tQ3T3OGQ56szAwaRb08jHPOnPn39whhGaXwHbhiBmAAy6afvVH8wqrBe3dW08hLW1PErPhghRcisVZk2fslHxh6bYXqe0s63iQ5E0I95pPa5KsDuHFogmLTmGdmAFuI607xjDH7XA41kF+vxw3d3Z+/U9qeUTESHaZ97hseDAMCWBL//bXBr7w6nJF0w4nNNcWfeaFnWLNtkTpopYskTBxJL9v9hV9G2Sm+7xumfc4FI6W/eorrSuJxhyHGPLNh+Mj89DXH28MBT1JmwxxpUw3V9C/ene1ecPh2O2afyuwVmmEQhED41VUDP9xYbnXpxsVN7+/OndaWjrT597WD3WlrWsFRig/SMEEkE0dOQ4vsXDD49J2WlAJxvAtAhEDzzDztrtErvdGYxxYj4mXwLHHje7I5iyf5KmaOQZSKg02XfKP93Veoev1w0I7Z591bSspwZ95RipNy2hboG/O5l/tu3VKbkRa3LG09a0omjLTRZkFzamHe+e7rg6VQL27z0PC+jnOCPUdhZtoxQRCWVj9ip7IEegJmQAae0yDv3BBGinFMwol4Lz0mfdUCqxROFq9iqlUr0L101l/fzFoj0SFLjqQjZdn043VD164uPrbHb5R4QrNrDFuShiJ99cq++3bWF+StW09pPbElFYZaEhJiHJu2lLywK3PPtsqDO6vL2tOuRUobwgNlhAjaZOadPvCnR01xp7Sd8caPCKHmqTnaUsZX+0YsWYxaOX3nrMyUFMdmwolqw5GGShB1f/oXma7ZJo4PGW8NgyAQAr+xeuD7GystrhwMTX+otlWiU1q8vkB9/PneJ/rCpY32f53WdkzBDSMtCGGkZYlagwA4d1q2z1ffWzc4P++0Z22lDoAZkY2yvJRonNb/zC9txxHJKYzPB5Hb0+LO9aFhBgCRtEgWd7jXLnHqMdM+ylwuFd2TL5t+6Ze07x/SLRsGKVABfO6lvtu31ZscMRSoL85vuPHUKYHmH64b/Pnmyh8Hoz9rtX9xantX2opi40giQkKINMcMiAgISvGJbamZafvf1g4S84KWlNHM+1NvRDIqzkw7trhpVbjtNdtLCeRJIWpajp7dbbaXlSAQRMAMn1ucOa2D/HhCPDAMoeKKwpnX3Ow1dRilDi5ezWBLrCpz9Qu9D/YEDbaoxvpbi5o/M68ZAOtK/2hD6fWKuqTL+9kp7U228JVxbXH31srfvNyfkbR8V/1TL/V7Ak5uTWnDSpmpGfu9U9I/f3P4lX7/7I6MwAnOb5xkjJCWaOjsffqXtiXkBOcFmiFrQ2DEI1sCAiBtwJPiz6YKX00UL7ACqpRLqYXvLRyzWAfhwcWrGWxJe/z4I8/2rOgP8xZFWt+4tPXjcxoB4Ind5UtX7N7h649NT/90aVtWUqwNIQDB5mq8Ymd9UyXqD/WmSjQU6sRFSMQ4Nlmin5zS0WCLq5/bvctXtk16n4iFJHQYNsw/3Zl/Tq1S0RNdjCCox3zOVMrYQjMIADh5ivuZd03WZ2Mg0FisBdOu+LfctGOMOpj1KgbHos2V8Io/9m6oalcQgbn19Pb3duYAYPm24c++2DcY8ydnZq5f3IqA2jAlUcTAnKz8X7OyZ7Z4C/P2pVPTy1q9nByJHYhgALTmU6ekc5L+bc1gkyNmN+4nIWOjhWMbsPqeu9v1PIlmTMoIoAy0pumZXXprSREALOuSjuBJB6cA636d2uc2H3+OidVB0gzF4Ni0atD/0LN7dgbsEOYk/OqsKcvaswBw+6ahz77YX1b8pWNy3z6xRWs2hsfa6Cjgqd7gb14ZfLLX/82O2jUvDfyh1yeJZrTMSWrV0Fdnd6S/v6Tt11vK/7FuyLKFJBxfCSEJE+umRedi88zA9zXjpKhhI5891U5cIy1pt2I92V0ppmq1njvhvXYma+LoQKFIMzs2rdhdu+K53oEIarHJW/CLM9rf1ZgaitTXV/V+6oW+iPkbCwpfPaE51gyw1wgZGBF7fLVyIOwJdH+k36rFw5Ha9yqSMIp0hytuPqVjONKfX9mz3Y8p4SBHvZOJQzffkFnw7mqtrlkwT3JdfFKrQERsTllPfijf4nJs9mLShisx7hoYPu4fl3ee+j7l+2MdDJzIg9gO/WZL+dpVQwFDs41nt3ndadHuSl9zZHjtcISIy1qcy2bk48jsJ3NCqMcm0OxKrCmuKVOwqMERSe65n4QUQTrivrdKu+rxuVPSseIGW3SkLGZmo6Xn7Xjq3jeuv7yzpTEtjBg9WgawEIoxvvuukjymQTa7qMwEJVCMfhhxrr0waxFrxnFtWR6XSNk23fLG8L+sLRrAZgtvWtJ8WkcGYsPMmBxsQu8yxJHZfz3AkLVE1gZgzloJZwWaGQ/QZgOAONAXT88Bc6RMwnkkwkQkNlyYs9ikW4IwcD0pxvVwYgONDh7TKOXcJukKqOhxmsagGGq+b89a7DW1mzhiBMWMDAwwdmyWRd9fO/iDN8oM2J2mny1tndfgBr4SbMaigomTlgWKEeZC79vNUMxjrGkSaTGhDxEBEdhMaFsgElIcGwSQiJPKQhPHqZZOq21WfcfLWS83vstjAGwBxzZJOaeBcIL9gwFWTH6gGqfOJ0GseUNJferlfpuoqsy3T2g8qyMNzN9YPfCzzRVEWJATt5za1pW2w1BbQpDtjC8+2QBHwUju63kTOCUDHAUIe7kpBAMG0HJAImhgFaHtIgGP1nPAwFFEbICI9xOPtXTsVNe88pvPaYOGJuRnyDy3QchpWZpkMIYh0hAoSE+Zk+iDr2FTVbmChkIdaAaET6/sXb7LB4TTm+2bl7Y22FYUaUsIE9Zrr60E1mPpu2yZKqfPxzg2Kq6v+yNHQQIPScjWbqtrNmsDKk6EiZbLAtRAj+rdStlGu2NWuGWNHtyJ0mY2RILyLbLrWHJdDoP9tAqZASA1ZXafgjgpuHGvVmvmqVmSLZ4wEwwYjeFYc4zgtUwdM56UQETIWUQIn3q+975dPiG8v8O9YUmrSxQrIxBASF3uL9/0adDRyN2QQGm5yz6S+/BXOQrKt3yJi71g2cCMJNDLygXL8h/5msg0chyh68W7N1eW/0i/tUrvfjN90Rfdy6/1H7vFf/y/MNsIRiMRummaMid7+VecuUv2hxkBwGueFjPEmo0AGveGYWj2UOYc0OMLZGDDEGmj0XJyTaO8GAQaUhL+enbmho2ll4uxQLhievrbi5qBYSSkJQonLNEyFVQEzADMcYgqqj98s5y+ILX0/SLfytIGEgDMQR0iP3ru3uHqcMNnbyYp492bitdfyQM7QNqQLkCmAZgp1yI750C6ADoGFZvygNny6vANVzf8/a/sqcdwHE3AjAAATr5Fg4i00Qxy3FuaIeeQ9AROolc1s9KGybZSucR3BJoLNnx8RvrJ3mB1SRHwZ+dkv7ywSSmGsXYMIqtYFNoKX7gVdIzSQcvWlWLpp5+jekm9+SKecUn+Uz8BMChstGztVyp3/StseiVe90yw+on0Ke+r3PUtHtyJTZ2pP/9r5/izRaZRx3Hqgk+m3n0FCBulBYT1Z+72H7wJ6uXaoz+3P3k9RPsJX9JLaxJKs2bEUceFAIY5bRO59gSVZgDNoA1oJBRWYtINDn1ginfn1vrTAxEBf2NB4cvHN8cxT+itMqO0dKmv9J+fHf7+ldGW1bKp3Zo2D900a4V2ihnKd1xX/O5Hg3VPi+YOZ+rc7OX/CEKC0WrP5mjPjviNlSBk6vxPZs/9mNXYhcJCy6o/ftvQv15cuev/UK5JpBuyF35KdC8EY/SuN40fgJATG+4IAGQ5BoUy+9ITSGykMYxiwqeMSUaMDAAjAjM4BKGBxY3OuxrtC6ekLpmRi0JD++m/IKjYDOwwxV6IAgSoPX6b3vUmSEfOPZmZ9dBus2crlAeB2YShyDZhugFKfYioe9/isIZe1p69mLXmOEzCEleKunebbJsBRnEcoUhR0xQ2ClkD6/0SCcxsDBhmM5KgTrhNGSmNNvKYajAYAAOotVZRCADGcLsrv3dS6wgvzhCHRhy41wTSRi8T71hf/O9/D568g+sl+8TzvUXvMX4VnRTaDggroeBYRaAiAKRcMxiTeDIgAiQgAmYEQMtGywFpJ7wcM4JfAWbINKDjQRxPLJEZAHQYaKUMOPuUVayBZD2ppsb5LWYGIBNHYa2U/EEixYoZRjT/EMMrWqOTCp76FdfLKC3rhPfk/+rbmDBgSUbBBoxGx4p3bDDlfnQz1rQFrBVaLgc1XdyDM45jpUYuM/IRBq1BSFOvqF1vIpKcOh8FcWQAJws5rFe0Vkm5BXvlCIRYi4wsBSDywBOLSETUytSL/SM5PhzhhA4zOikx4wT3tEvSp18KAKz0qDtlkBaRiKul+sM3QxyKmYusafNMvUJNU0z/9vrjtznHnS4yGVbjbJAEuQ4D1B64wQzsgFTWPemCkdx6ojIDQH2o12hGJBjfrGYQCMOhkX11TZOMGBAR2UC5Z+tITXNkg02Sa0PueVfnP/yPAMBhBGyARgMEWXqop/7Sw7WHf6a3vsbCSl/4GRRC5BucUy6q/+Z7+q1VQ9dfmVr2IdExx5m1EACAiMO6v/ZZ/4X745cehKBuv+dKZ86i/eceAOU9W4HHAR3VYELor7PcVjaEYlwpBYSMyCRgcPsbSbZ0hGSRARVTqoAAplYFae+Vg47Q8cJn7/YfvRWMxkxD5rJ/8E46l30fhMicf5V669X41cf1ppcr657Fzrkt334S2AAJ3bO59N2/5DgE23XO+Iv8R77GcbRvgysp+ge3bxQEiEzI41VaIO6oKLmxaAzjGBeBAIRIzLYlBres07Eanak5bHbTS0OUAyIABhJgNBAldgu2B04K3LTsmG11H++e+RfOrBM4CIAEGCbpFD59Y/XRn0evPGwGdqKQwACWi14OMw3Y3CXbZ7mLz3cX/yloDUbvC5iEVH44tHW97UgCJtxrwwjAiBuLBpd0uMs/mB0ftCoh76nznkrUF1lX3PpyY9dMFYWHx4YiG2XqZTAG3RTZHiChLU0QkW0zgh7cA0aDtMjLkucBAwfB3hkrZiCBjmX8uh7qYaOt1m4TVCEKWEh00iKdRgAThPslV5mNdNy+t9bf9cmlHR60Z2RbGlMWjmtu0aUPVOSmou71eUoKotEGgCSQyI5tRf3DO9aubJw2i41BcTiAGUnKfEsyboSIqjJYf+a/MxdcE6x5Shf3pM/+EMQ6qQrZH52MIEKSST3IKmLfR5JWxywkMGFEqTymC0AEWrMfcKI1+722MYCwc83zqlqxcw2SeKxUYgCLoD/gjUOKioHaUNSu3Et5EYJFKAmlgE3PPXSEZsysYlYRmBikMMN99cdvJduKd6wPXrgPgFnHxmg1sBOIQFoAaPyq6t+hhveovm1sDAgBJIxfjba/AUhgNDPrYp8JqslbBzYmBIDNzz1kC5ACJIEYV+G7AjcWzUBdSwBeuVt9YIbLPCJiQrYFS+Rsxt328hOV/r5MQ5NWCg9znCH5N0ZgAMshpOL3PxHv3ihnnQiADDz8i39Qb7wgpy8sXPU9SmXLt1wXb3oFLZfZWLNPavjk9Xp4sHTbl/XQbjllbuM1P6i99FD5jm/kr/mhN+8UjqL9emZmFrYz3LNzx6oVTRnXAmMRjUnYMFgCX9qjAZgA4Jmdqq72nocgtATaBCnPrfX2rH/qAZQHGw072EiU0YxkL1wmu46FoIoAum+H3vpqw1d+rbatiXveQgSulVIX/a1obM999J/0ro0cKzW425QHrJknmOFeQEDbo4Y2Z/ZJrPSBmDU2GgWte/K+cGgg5bk2gS1grCNCCKGGp3aEI/zwmv5o47AZ02oEtAhciQ5BxhMv33+LjhUdMdOPwECWTbnmzLlX2vPPAL8CAFRoBcsJnr4LUznZ1MkMQEKmG5iZUllAMH7V7prL9Uq48v7cld/iKHYXLpONHbXf30y2Bcbsf6pMSBWGq393W8aTNrEtUdKIJRoGV8KmEq/qjQCAJEGk9SNbY89CMzpcYhHYAh0yhVy657UX1j/7sHBso9WRT294bLQOIgbgfIthwEzBPftj1ftv9JZ9WDQ0s9KQbYJ0gRo7mQQ1TwUAtJ3cX/4ztc8KN7+CUgTrn9d7toDjMvN+u8VGK+HYa1c80Lf+T4Vc2kF2BI7NvhqGlMTHtqlAGUGAydDacS3u45dl1Sj3r7QpR9Dvmz4ftvZW0see+plbVxil8QimkhhIqupwsOU1b8GZQsfCKHA8YAZpmcqw8XJGxwAIKhTSYR2DkMAGSQAzOo6JItAKpcVGg9bopSGODszP4k0fPz3auqq7JdPiQbNHWRuTfiMzOBadd29l1Z5AIIgk5+qrmVM7nWMbKEjalwiGQWmIlGHL2bJxU7Zr1vQFJ+koPMxJB8PIzHYq5XbOFGgAaNiIwSAeirQfKnI8F7WwhCAgYSlmEJIQRugrRFAxIqIQwIyIKCQolRgwT2yPG62k5z1378//dM9Pu1pzeZsLDmUstAUiomHI2vBcD//w5WoymydHBw3NrWuDc6engQ0gEqJF7FqYsiiluCnnPPTj644744JMvtHoQ3CIidpZNgHD+qL/eE/1haF4UyUeCHVoAIA9QY02zchYxxfsM1rcJY2O50gwrDVoY5LbSS6RdFM5qVFHf7MFAYLWnMReYTvFnl2P/sc/NRWclOC0ha6EZP4hEa8g+sXaOjMLhJECOunjbB0250xzpucwGvGFzAyaOdbGCLt3d19/f++J51+qo4ONszAkg+P4+53Vr706+NNN5TerKmeJOVnrpEbn2JzV6UlbYF+oVxWjJ/uC3+2qPdHr76mrrIVtrpSWEIQCgSZMGIMgEgKFRUKKvlq8qx43OoJHsiv7jq9/Ymjdi53NmYINBYfSNrqCEvGmLVgzCNc9WzEjpdRol4sQYqN/tMq/84K0iTQhCkRbsGdhxhb1WHe2ZV9Z/n9nLz5r2eWfiGo1Ia39yxZxez2+d1tlKOYrZ+QWNTpTPAnj2wUGjDG9gV5dDB7b46/oC14eip4fCP9zU/mEgn1qs7Oo0ZmdsVsckRJJdofGcFXp3b5eVQxfGQqyEj/UnQVEHUdOOv2HO25a89A9c7tyadIZW7gSbRppWhtmR4ofr/IjbQSNzvtNJDLotxcXlk3BUgQCQRmux1wKTb9v+urQU1E9VfzCbY/POfHUqFYXUu6bcVRi82Y57M7YzRk7WcrQhscvYSRsoCAEgcDQU4v+0Os/2lN/pRjtqmtfs01QsKnFETmLLITYQE2ZujYS8biC/ZHpmQumZARhFIZ2Or3hhad+cvV5XXnRnqVWD5s9kXcwJZEIEx78xV54371FZjOWR+KkwbTFHe5Dl2T92BACM4caapEZCnmgbvoC3D5QD1JtX75zRXv37KheF/sEZ2aQAgEg0ibp7x6AURqJ+bbAZNtsezVaMxytK8Xb66onUL2BNgx5i5od6k5bixqck5udzowNADo2Siknndr15vrvfuycTDw0rdFr8bjZo4JDGQtsSUk0Stt04W+rz+/0x49P476Tpf96VsMX3iX66mwRaMO+4krExcD01XkgxLf2VGT73C/f/khL5/T9ypkPc5diHHICkGIv8wbGRJpHjoMIaKSZmrCtrJWdTu3Ztvk7V76XhrZOb8u0OtziUcGljA2eQCJUBppT+J+vqb97cnjSgLyYlB0Rwos96rwZXkeKQ5NQZzyWpBmjpev279793GO/P37ZeYW2dhUGNDGhxyNZhko0HEeiIGvN2nBSrBOiZtCatTZaj7QsjI7tdHr7G69/568uMP1bprdmm2zT6FHOoYyFrgApyDCkLNhcxqseKUf7DEiIfe0wVOa1Af7oPEcbTo4AxzV5jDGO5/Xv2f3kA/fOXLikY+YcHUUweVjo7eTdyW5bYgVjxFCytEMIYEwS2F995vHrr/4AVXZ3t+WaHNPkUcHBrI2eJEsgICKwJcWVD9XfHAqTNvPBADOAINhZVhUlLppjVSMjCBFhJK4hIQIbY3tutTT82L13OtmGeUtOIyFUFBEdjUH4fdWEWWtteZ6w5PKf/eCn1/7vPPnTmtONjmn2RN7FrIMpSbZAItKGm1Pi68+H92yoJgN3h56IZwZB8FJP3Jaxl3WK8uhOFo3CJgIwxrYtBn7qgfu3vLFu7olLc80trLXWigjhaK1bMmujhZDSc3u2v3XDl/7qsVtumNpkdRTsJoebPCq4lLMxZaEjUBDGBlpTdPsG/fVnyoJAm8NbARhJhBEe3xYf3+qc0EyVGKykQYSJ40UiQGRJlErbG1evfuK3vyTLnb3gRDvlgWGtVKIUbx+pMUZrIaV03TAM77/1xzd+8WN9G1bN6sy0eNjsYbNHBZeyFqYtciRKwmSB6YmdeNXDJcOGDzCOKw6iVdrww1vjkzvdeQ1QjcESgMCJRSWZiUQg5kzGjfzKsw8++MIfHpRuqmvWsU46RUKaODajVfThgGdmZjZGI4D0XGFbgV//w7133vj3n3junjuaU2paS7rRMS0eNXmYdylnY9pCW6AlMDbQ5MKLffjR35WqkcIDr+UdelEr78pfvb+wrAP6fbaQlYFAgx9zJTaVyAwHXAx4OIKqgj2DtWIdphwzf9nFV5xxwSVds48ZQRJrreKxPuH42DyWkhCSsCwcncvYvnHDs7+/55nf3tG78Y3GLLQ1ZDKWKdjU4GLexZxNGQs9Cx0BkiA22Ozhyl748AOlgXp8kKWlQ8fL5MMZR956fv593dhfT1Z2OdLsK6jFphJxOeRSyKWQqwpqMfSXasUyOIXM7EWnLVp23nEnnzF15tx0oXBICVeLxR2b31j74jOrn3508+rno3KtKQfN+UzKgqw0eQfzDuUdytiQluRKtAUkoaslhY9u548/VC4Fh0B7WAlC8hVSiOvPzn1igRwOtGZCNqHhUKGvTC3mSsTliMuhqUZc1+RrqNajoXJUC0G4VOiY2tE9t2PG3JbO6Q0tbelMXkoLEeI4qlVKw/29vTu39mzduGfrpuE9O0xgMi405O2sZ7sC0oIzNuZsyDmUsTEt0bPQFWARJsNFjS7dtk7/7R9KkdaHRHu4GVHCKzPgNYsy/3yqK9FUIyBkZSDSHGiux1CLTTXiSsT1mGsx+xojg6EGP1L1IKz7HESgEw0e3c1jBjQjjWHXgpRHKc/xbOEQOmQ8CSkL0xZkbMzalJaYssgRYAuWhJoxY4FB8c2VwY9frgDw4aA9/BRwdPKRYekU7/qz04tasOibJNWLDUeaAwW+SpBzLWZfcaA40MlQMCpGzZgwz6O07YjPJ0KBIJElgoXGFuBKciV4EtMWpixIW+hJcgXYAi0CBiDCBhfXDsKXVtT/uLM+SuMeLpAj4ckItIG0Lb58SvbqBbZLuhQxMDBzbDAyI7btx+xrDmIONYeaIw2xQWVYMxjm0XmDkTFEgSgQpECLwBLgELgSXYmeRE+iK9ERYAuQRAgMCDkbY6Zb1sbfeqFWCeMDxdujA3jMpAFgSYf3laWpd08VxuhqPDKbqg0kAo80+IpDDZHmyHCsURvWzHqE7k1qZxiJcAQSwSK0JdgCXIGOQEegJcAikAkphpCxUBKt2GW+tbK+cpcPb+v5Fvi2895kUPTC2d7fLHKXthMxV+KE02VmNMyx4VhDZDg2ECdPMGFWzMzAnCSqjAgCSRJLHIFnC5CE1sizW5CBJWHGQkBc2WtuWh0s3+gDmLf9BJO3nwzttRyk82Z4Hz/OObNLFCwONfsKxhaPmMFwMjTChjHxWzzaD044PkGJnFkkuT8gAAtCT4IrsBTTs7vU7a8Hv38rYDZj3uRtZ+nv6DVOqXB+s/P+2fb53da8RsparA0kBjwqinGV8tgsIeJ4nl4g22IkMa7GsL5oHt0a378pWts/sh77Tp7RcnQAj8Eea2IQ0YJm+/ROubTDmtdEHSlMS0j2pAzzPg8fwpGSEEEbqCncU+cNQ3plj/rjrvi1/sgYM6oL7xTq0QQ8puSEMH40I22LWQVrToOY3SCn5URbCgoOpiUmi43KQF3xcAh76mZHWW8e1huLevNwXA31uNHwyQ9oeoev/wfSeuVkiw+PUQAAAABJRU5ErkJggg==";

const PDCDLogo = ({ size = 40 }) => (
  <img src={LOGO_SRC} alt="PDCD Homes" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }} />
);

const Check = ({ checked, color, onClick, size = 20 }) => (
  <div onClick={e => { e.stopPropagation(); onClick?.(); }} style={{
    width: size, height: size, borderRadius: "50%",
    border: checked ? "none" : `2px solid ${BORDER}`,
    background: checked ? (color || BLUE_MID) : "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", flexShrink: 0, transition: "all 0.15s",
  }}>
    {checked && <svg width={size*0.6} height={size*0.6} viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
  </div>
);

const Bar = ({ value, color, h = 4, w = "100%" }) => (
  <div style={{ width: w, height: h, background: "#E2E8F0", borderRadius: h, overflow: "hidden" }}>
    <div style={{ height: "100%", width: `${value}%`, background: color || BLUE, borderRadius: h, transition: "width 0.4s" }} />
  </div>
);

const now = () => new Date().toLocaleDateString("en-AU",{day:"2-digit",month:"short",year:"numeric"}) + " " + new Date().toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"});

export default function App() {
  const [sites, setSites] = useState(INITIAL_SITES);
  const [tasks, setTasks] = useState(() => initTasks(INITIAL_SITES));
  const [view, setView] = useState("list");
  const [activeSite, setActiveSite] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", client: "", start: "", finish: "", budget: "" });
  // Notes state
  const [taskNotes, setTaskNotes] = useState({
    // Demo notes: { "siteId-stageId-taskIdx": [{text, time, author}] }
    "1-slab-5": [{ text: "Slab poured successfully. No issues.", time: "12 Mar 2025 09:15", author: "KT" }],
    "1-brick-1": [{ text: "Bricklayer delayed — rescheduled to next Monday.", time: "28 Mar 2025 14:30", author: "KT" }, { text: "Bricklayer arrived. Work in progress.", time: "31 Mar 2025 07:45", author: "SP" }],
    "2-preliminary-17": [{ text: "Permit received from council. Forwarded to client.", time: "10 Feb 2025 11:00", author: "SP" }],
  });
  const [projectNotes, setProjectNotes] = useState({
    1: [
      { text: "Client requested minor layout change to kitchen — waiting for revised drawings.", time: "15 Mar 2025 10:20", author: "MP" },
      { text: "Council inspection passed for slab stage.", time: "18 Mar 2025 16:00", author: "KT" },
    ],
    2: [{ text: "Geotech report shows rock — may need additional excavation budget.", time: "22 Jan 2025 09:30", author: "SP" }],
  });
  const [noteModal, setNoteModal] = useState(null); // {siteId, stageId, taskIdx, taskName}
  const [noteText, setNoteText] = useState("");
  const [projNoteText, setProjNoteText] = useState("");
  const [showProjNotes, setShowProjNotes] = useState(false);

  const toggle = (siteId, stageId, ti) => {
    setTasks(p => ({
      ...p,
      [siteId]: { ...p[siteId], [stageId]: { ...p[siteId][stageId], [ti]: !p[siteId][stageId][ti] } }
    }));
  };

  const addTaskNote = () => {
    if (!noteText.trim() || !noteModal) return;
    const key = `${noteModal.siteId}-${noteModal.stageId}-${noteModal.taskIdx}`;
    setTaskNotes(p => ({
      ...p,
      [key]: [...(p[key] || []), { text: noteText.trim(), time: now(), author: "MP" }]
    }));
    setNoteText("");
  };

  const addProjectNote = (siteId) => {
    if (!projNoteText.trim()) return;
    setProjectNotes(p => ({
      ...p,
      [siteId]: [...(p[siteId] || []), { text: projNoteText.trim(), time: now(), author: "MP" }]
    }));
    setProjNoteText("");
  };

  const addProject = () => {
    if (!newProject.name.trim()) return;
    const id = Math.max(...sites.map(s => s.id), 0) + 1;
    const ns = { id, ...newProject };
    setSites(p => [...p, ns]);
    setTasks(p => {
      const nt = { ...p, [id]: {} };
      STAGES.forEach(st => {
        nt[id][st.id] = {};
        st.tasks.forEach((_, i) => nt[id][st.id][i] = false);
      });
      return nt;
    });
    setNewProject({ name: "", client: "", start: "", finish: "", budget: "" });
    setShowAdd(false);
  };

  const removeProject = (id) => {
    setSites(p => p.filter(s => s.id !== id));
    setTasks(p => { const n = {...p}; delete n[id]; return n; });
    if (activeSite === id) { setView("list"); setActiveSite(null); }
  };

  const getTaskNoteCount = (siteId, stageId, ti) => (taskNotes[`${siteId}-${stageId}-${ti}`] || []).length;
  const getProjectNoteCount = (siteId) => (projectNotes[siteId] || []).length;

  const site = sites.find(s => s.id === activeSite);

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Segoe UI', -apple-system, sans-serif", color: TEXT }}>
      
      {/* ====== TOP NAV ====== */}
      <div style={{
        background: `linear-gradient(135deg, ${BLUE_DARK} 0%, ${BLUE_MID} 100%)`,
        color: "#fff", padding: "0 20px", height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <PDCDLogo size={40} />
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 0.5 }}>PDCD Homes</div>
            <div style={{ fontSize: 10, opacity: 0.7, letterSpacing: 1 }}>CONSTRUCTION TRACKER</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ 
            fontSize: 11, background: "rgba(255,255,255,0.15)", padding: "4px 12px",
            borderRadius: 20, letterSpacing: 0.5,
          }}>
            {sites.length} Active Projects
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: "50%", background: ORANGE,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 13, border: "2px solid rgba(255,255,255,0.3)",
          }}>MP</div>
        </div>
      </div>

      {/* ====== BREADCRUMB ====== */}
      <div style={{ background: WHITE, borderBottom: `1px solid ${BORDER}`, padding: "10px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
            <span style={{ color: BLUE_MID, cursor: "pointer", fontWeight: 600 }}
              onClick={() => { setView("list"); setActiveSite(null); setExpanded({}); }}>
              📊 All Projects
            </span>
            {site && <>
              <span style={{ color: TEXT_MUTED }}>›</span>
              <span style={{ fontWeight: 600 }}>{site.name}</span>
            </>}
          </div>
          {view === "list" && (
            <button onClick={() => setShowAdd(true)} style={{
              background: ORANGE, color: "#fff", border: "none",
              padding: "8px 18px", borderRadius: 6, cursor: "pointer",
              fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 6,
              boxShadow: "0 2px 6px rgba(233,113,50,0.3)",
            }}>
              + New Project
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 16px" }}>

        {/* ====== ADD PROJECT MODAL ====== */}
        {showAdd && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 1000, padding: 16,
          }} onClick={() => setShowAdd(false)}>
            <div onClick={e => e.stopPropagation()} style={{
              background: WHITE, borderRadius: 12, padding: "28px 32px",
              width: "100%", maxWidth: 500, boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>Add New Project</div>
                  <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>Director sets up once — supervisors just tick tasks</div>
                </div>
                <button onClick={() => setShowAdd(false)} style={{
                  background: "none", border: "none", fontSize: 20, cursor: "pointer", color: TEXT_MUTED,
                }}>✕</button>
              </div>

              {[
                { key: "name", label: "Project Address *", placeholder: "e.g. 45, Ocean View Dr, The Entrance", type: "text" },
                { key: "client", label: "Client Name", placeholder: "e.g. Smith Family", type: "text" },
                { key: "start", label: "Start Date", placeholder: "", type: "date" },
                { key: "finish", label: "Estimated Finish", placeholder: "", type: "date" },
                { key: "budget", label: "Budget / Estimation", placeholder: "e.g. $385,000", type: "text" },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: TEXT_MID, display: "block", marginBottom: 4 }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={newProject[f.key]}
                    onChange={e => setNewProject(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{
                      width: "100%", padding: "10px 12px", border: `1px solid ${BORDER}`,
                      borderRadius: 6, fontSize: 14, outline: "none", background: BG,
                      boxSizing: "border-box",
                    }}
                    onFocus={e => e.target.style.borderColor = BLUE}
                    onBlur={e => e.target.style.borderColor = BORDER}
                  />
                </div>
              ))}

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button onClick={() => setShowAdd(false)} style={{
                  flex: 1, padding: "10px", border: `1px solid ${BORDER}`, background: WHITE,
                  borderRadius: 6, cursor: "pointer", fontSize: 14, color: TEXT_MID,
                }}>Cancel</button>
                <button onClick={addProject} style={{
                  flex: 1, padding: "10px", border: "none", background: ORANGE,
                  color: "#fff", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 700,
                  opacity: newProject.name.trim() ? 1 : 0.5,
                }}>Create Project</button>
              </div>

              <div style={{
                marginTop: 16, padding: "10px 14px", background: "#F0F9FF",
                borderRadius: 6, fontSize: 12, color: BLUE_MID, border: `1px solid ${BLUE}33`,
              }}>
                ℹ️ All {totalTasks()} tasks from your construction checklist will be automatically added. Supervisors only need to tick completed tasks.
              </div>
            </div>
          </div>
        )}

        {/* ====== PROJECT LIST ====== */}
        {view === "list" && (
          <>
            {/* Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Active Projects", value: sites.length, icon: "🏗️", bg: "#F0F9FF", accent: BLUE_MID },
                { label: "Average Progress", value: sites.length ? Math.round(sites.reduce((a, s) => a + siteProgress(tasks, s.id), 0) / sites.length) + "%" : "0%", icon: "📊", bg: ORANGE_LIGHT, accent: ORANGE },
                { label: "Claims Due", value: sites.filter(s => { const cs = currentStage(tasks, s.id); return cs?.tasks?.some(t => t.isClaim); }).length, icon: "💰", bg: "#FEF9C3", accent: "#D97706" },
                { label: "Total Tasks", value: totalTasks() + " per site", icon: "📋", bg: GREEN_BG, accent: GREEN },
              ].map((c, i) => (
                <div key={i} style={{
                  background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 10,
                  padding: "16px 18px", borderLeft: `4px solid ${c.accent}`,
                }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: c.accent }}>{c.value}</div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2, fontWeight: 500 }}>{c.label}</div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "36px 1fr 110px 90px 90px 90px 90px",
                padding: "10px 16px", background: "#F8FAFC",
                borderBottom: `2px solid ${BORDER}`,
                fontSize: 11, fontWeight: 700, color: TEXT_MID, gap: 8,
                textTransform: "uppercase", letterSpacing: 0.5,
              }}>
                <div></div>
                <div>Project Name</div>
                <div>Current Stage</div>
                <div>Start</div>
                <div>Est. Finish</div>
                <div>Budget</div>
                <div>Completion</div>
              </div>

              {sites.length === 0 && (
                <div style={{ padding: 40, textAlign: "center", color: TEXT_MUTED }}>
                  No projects yet. Click <strong style={{color: ORANGE}}>+ New Project</strong> to get started.
                </div>
              )}

              {sites.map((s, idx) => {
                const tp = siteProgress(tasks, s.id);
                const cs = currentStage(tasks, s.id);
                return (
                  <div key={s.id}
                    onClick={() => { setActiveSite(s.id); setView("detail"); setExpanded({}); }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "36px 1fr 110px 90px 90px 90px 90px",
                      padding: "14px 16px", gap: 8,
                      borderBottom: idx < sites.length - 1 ? `1px solid #F1F5F9` : "none",
                      cursor: "pointer", alignItems: "center",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#F8FBFF"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <Check checked={tp === 100} color={GREEN} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 1 }}>{s.client}</div>
                      <div style={{ display: "flex", gap: 2, marginTop: 6 }}>
                        {STAGES.map(st => {
                          const sp = stageProgress(tasks, s.id, st.id);
                          return <div key={st.id} style={{
                            width: 20, height: 4, borderRadius: 2,
                            background: sp === 100 ? st.color : sp > 0 ? st.color + "44" : "#E2E8F0",
                          }} />;
                        })}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 10, padding: "3px 8px", borderRadius: 20,
                      background: cs.color + "15", color: cs.color,
                      fontWeight: 700, textAlign: "center", whiteSpace: "nowrap",
                      overflow: "hidden", textOverflow: "ellipsis",
                    }}>{cs.name.replace(/^\d_/, '')}</div>
                    <div style={{ fontSize: 12, color: TEXT_MUTED }}>{s.start || "—"}</div>
                    <div style={{ fontSize: 12, color: TEXT_MUTED }}>{s.finish || "—"}</div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{s.budget || "—"}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Bar value={tp} color={tp === 100 ? GREEN : BLUE_MID} w={40} h={6} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: tp === 100 ? GREEN : TEXT }}>{tp}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ====== SITE DETAIL ====== */}
        {view === "detail" && site && (
          <>
            {/* Top Info */}
            <div style={{
              background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 10,
              padding: "18px 22px", marginBottom: 14,
              display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14,
            }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 600, marginBottom: 6 }}>OVERALL PROGRESS</div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Bar value={siteProgress(tasks, site.id)} color={BLUE_MID} w={220} h={10} />
                  <span style={{ fontSize: 22, fontWeight: 800, color: BLUE_MID }}>{siteProgress(tasks, site.id)}%</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 20, fontSize: 13, flexWrap: "wrap" }}>
                {[
                  { label: "Start", val: site.start || "—" },
                  { label: "Est. Finish", val: site.finish || "—" },
                  { label: "Budget", val: site.budget || "—" },
                ].map((d, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600, marginBottom: 2 }}>{d.label}</div>
                    <div style={{ fontWeight: 700 }}>{d.val}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => removeProject(site.id)} style={{
                background: "#FEE2E2", color: RED, border: "none",
                padding: "6px 14px", borderRadius: 6, cursor: "pointer",
                fontSize: 12, fontWeight: 600,
              }}>Remove Project</button>
            </div>

            {/* Task Grid */}
            <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr 40px 70px 70px",
                padding: "10px 16px", background: "#F8FAFC",
                borderBottom: `2px solid ${BORDER}`,
                fontSize: 11, fontWeight: 700, color: TEXT_MID, gap: 8,
                textTransform: "uppercase", letterSpacing: 0.5,
              }}>
                <div></div>
                <div>Task Name</div>
                <div>Notes</div>
                <div>Duration</div>
                <div>Status</div>
              </div>

              {STAGES.map(stage => {
                const sp = stageProgress(tasks, site.id, stage.id);
                const isOpen = expanded[stage.id];
                const doneN = stage.tasks.filter((_, i) => tasks[site.id]?.[stage.id]?.[i]).length;
                return (
                  <div key={stage.id}>
                    <div
                      onClick={() => setExpanded(p => ({ ...p, [stage.id]: !p[stage.id] }))}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "32px 1fr 40px 70px 70px",
                        padding: "12px 16px", gap: 8,
                        borderBottom: `1px solid #F1F5F9`,
                        cursor: "pointer", alignItems: "center",
                        background: sp === 100 ? "#F0FFF4" : isOpen ? "#F8FBFF" : "transparent",
                      }}
                    >
                      <Check checked={sp === 100} color={stage.color} />
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{
                          fontSize: 10, display: "inline-block",
                          transform: isOpen ? "rotate(90deg)" : "none",
                          transition: "transform 0.15s", color: TEXT_MUTED,
                        }}>▶</span>
                        <div style={{ width: 4, height: 22, borderRadius: 2, background: stage.color, flexShrink: 0 }} />
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{stage.name}</span>
                        <span style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 500 }}>({doneN}/{stage.tasks.length})</span>
                      </div>
                      <div></div>
                      <div style={{
                        fontSize: 10, padding: "3px 8px", borderRadius: 20, textAlign: "center", fontWeight: 700,
                        background: sp === 100 ? GREEN_BG : sp > 0 ? YELLOW_BG : "#F1F5F9",
                        color: sp === 100 ? "#16A34A" : sp > 0 ? "#D97706" : TEXT_MUTED,
                      }}>
                        {sp === 100 ? "✓ Done" : sp > 0 ? `${sp}%` : "Pending"}
                      </div>
                    </div>

                    {isOpen && stage.tasks.map((task, ti) => {
                      const isDone = tasks[site.id]?.[stage.id]?.[ti];
                      const nc = getTaskNoteCount(site.id, stage.id, ti);
                      return (
                        <div key={ti} style={{
                          display: "grid",
                          gridTemplateColumns: "32px 1fr 40px 70px 70px",
                          padding: "9px 16px 9px 52px", gap: 8,
                          borderBottom: `1px solid #F8FAFC`,
                          alignItems: "center",
                          background: task.isClaim ? "#FFFBEB" : WHITE,
                        }}>
                          <Check checked={isDone} color={stage.color} onClick={() => toggle(site.id, stage.id, ti)} />
                          <div style={{
                            fontSize: 13,
                            color: isDone ? TEXT_MUTED : TEXT,
                            textDecoration: isDone ? "line-through" : "none",
                            fontWeight: task.isClaim ? 700 : 400,
                          }}>{task.name}</div>
                          <div
                            onClick={() => { setNoteModal({ siteId: site.id, stageId: stage.id, taskIdx: ti, taskName: task.name }); setNoteText(""); }}
                            style={{
                              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                              gap: 3, fontSize: 12, color: nc > 0 ? ORANGE : TEXT_MUTED,
                              background: nc > 0 ? ORANGE_LIGHT : "transparent",
                              borderRadius: 12, padding: "2px 6px",
                            }}
                            title="Add/view notes"
                          >
                            📝{nc > 0 && <span style={{ fontSize: 10, fontWeight: 700 }}>{nc}</span>}
                          </div>
                          <div style={{ fontSize: 11, color: TEXT_MUTED }}>{task.duration}</div>
                          <div style={{
                            fontSize: 10, padding: "2px 6px", borderRadius: 12, textAlign: "center", fontWeight: 600,
                            background: isDone ? GREEN_BG : "#F1F5F9",
                            color: isDone ? "#16A34A" : TEXT_MUTED,
                          }}>
                            {isDone ? "✓ Done" : "To Do"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* ====== PROJECT NOTES PANEL ====== */}
            <div style={{
              marginTop: 16, background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden",
            }}>
              <div
                onClick={() => setShowProjNotes(p => !p)}
                style={{
                  padding: "14px 18px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  borderBottom: showProjNotes ? `1px solid ${BORDER}` : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16 }}>📋</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: BLUE_MID }}>Project Notes</span>
                  {getProjectNoteCount(site.id) > 0 && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, background: ORANGE_LIGHT, color: ORANGE,
                      padding: "2px 8px", borderRadius: 12,
                    }}>{getProjectNoteCount(site.id)} notes</span>
                  )}
                </div>
                <span style={{ fontSize: 12, color: TEXT_MUTED, transform: showProjNotes ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>▶</span>
              </div>

              {showProjNotes && (
                <div style={{ padding: "14px 18px" }}>
                  {/* Existing notes */}
                  {(projectNotes[site.id] || []).map((note, i) => (
                    <div key={i} style={{
                      padding: "10px 14px", marginBottom: 8,
                      background: BG, borderRadius: 8, borderLeft: `3px solid ${BLUE}`,
                    }}>
                      <div style={{ fontSize: 13, color: TEXT, lineHeight: 1.5 }}>{note.text}</div>
                      <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 6, display: "flex", gap: 10 }}>
                        <span style={{ fontWeight: 600 }}>{note.author}</span>
                        <span>{note.time}</span>
                      </div>
                    </div>
                  ))}

                  {(projectNotes[site.id] || []).length === 0 && (
                    <div style={{ fontSize: 13, color: TEXT_MUTED, padding: "8px 0" }}>No project notes yet.</div>
                  )}

                  {/* Add note */}
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <input
                      value={projNoteText}
                      onChange={e => setProjNoteText(e.target.value)}
                      placeholder="Add a project note..."
                      onKeyDown={e => e.key === "Enter" && addProjectNote(site.id)}
                      style={{
                        flex: 1, padding: "10px 12px", border: `1px solid ${BORDER}`,
                        borderRadius: 8, fontSize: 13, outline: "none", background: WHITE,
                      }}
                      onFocus={e => e.target.style.borderColor = BLUE}
                      onBlur={e => e.target.style.borderColor = BORDER}
                    />
                    <button onClick={() => addProjectNote(site.id)} style={{
                      background: BLUE_MID, color: "#fff", border: "none",
                      padding: "10px 16px", borderRadius: 8, cursor: "pointer",
                      fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
                      opacity: projNoteText.trim() ? 1 : 0.5,
                    }}>+ Add</button>
                  </div>
                </div>
              )}
            </div>

            {/* Supervisor note */}
            <div style={{
              marginTop: 16, padding: "14px 18px", background: WHITE,
              border: `1px solid ${BORDER}`, borderRadius: 10,
              borderLeft: `4px solid ${BLUE}`,
              fontSize: 13, color: TEXT_MID,
            }}>
              <strong style={{ color: BLUE_MID }}>👷 Supervisor Mode:</strong> Tap the circle to mark tasks complete. Tap 📝 to add a note. Use Project Notes for general updates. Simple.
            </div>
          </>
        )}
      </div>

      {/* ====== TASK NOTE MODAL ====== */}
      {noteModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 1000, padding: 16,
        }} onClick={() => setNoteModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: WHITE, borderRadius: 12, padding: "24px",
            width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            maxHeight: "80vh", overflowY: "auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: BLUE_MID, letterSpacing: 1, textTransform: "uppercase" }}>Task Notes</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4, lineHeight: 1.4 }}>{noteModal.taskName}</div>
              </div>
              <button onClick={() => setNoteModal(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: TEXT_MUTED }}>✕</button>
            </div>

            {/* Existing task notes */}
            <div style={{ marginBottom: 16 }}>
              {(taskNotes[`${noteModal.siteId}-${noteModal.stageId}-${noteModal.taskIdx}`] || []).map((note, i) => (
                <div key={i} style={{
                  padding: "10px 14px", marginBottom: 8,
                  background: BG, borderRadius: 8, borderLeft: `3px solid ${ORANGE}`,
                }}>
                  <div style={{ fontSize: 13, color: TEXT, lineHeight: 1.5 }}>{note.text}</div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 6, display: "flex", gap: 10 }}>
                    <span style={{ fontWeight: 600 }}>{note.author}</span>
                    <span>{note.time}</span>
                  </div>
                </div>
              ))}
              {(taskNotes[`${noteModal.siteId}-${noteModal.stageId}-${noteModal.taskIdx}`] || []).length === 0 && (
                <div style={{ fontSize: 13, color: TEXT_MUTED, padding: "8px 0" }}>No notes yet for this task.</div>
              )}
            </div>

            {/* Add note input */}
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Add a note... e.g. 'Plumber delayed, rescheduled to Thursday'"
              rows={3}
              style={{
                width: "100%", padding: "10px 12px", border: `1px solid ${BORDER}`,
                borderRadius: 8, fontSize: 13, outline: "none", resize: "vertical",
                fontFamily: "inherit", boxSizing: "border-box", background: BG,
              }}
              onFocus={e => e.target.style.borderColor = BLUE}
              onBlur={e => e.target.style.borderColor = BORDER}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={() => setNoteModal(null)} style={{
                flex: 1, padding: "10px", border: `1px solid ${BORDER}`, background: WHITE,
                borderRadius: 8, cursor: "pointer", fontSize: 13, color: TEXT_MID,
              }}>Close</button>
              <button onClick={() => { addTaskNote(); }} style={{
                flex: 1, padding: "10px", border: "none", background: ORANGE,
                color: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700,
                opacity: noteText.trim() ? 1 : 0.5,
              }}>Save Note</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        textAlign: "center", padding: "24px 16px 32px", fontSize: 11, color: TEXT_MUTED,
        borderTop: `1px solid ${BORDER}`, marginTop: 40, background: WHITE,
      }}>
        <span style={{ fontWeight: 700, color: ORANGE }}>PDCD Homes</span> — Construction Tracker • Built with 🧡
      </div>
    </div>
  );
}
