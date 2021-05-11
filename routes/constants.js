const companyFields = [
    {
      propKey: "companyName",
      elementKey: "companyName",
    },
    {
      propKey: "location",
      elementKey: "location",
    },
    {
      propKey: "category",
      elementKey: "category",
    },
    {
      propKey: "hrEmail",
      elementKey: "hrEmail",
    },
    {
      propKey: "username",
      elementKey: "username",
    },
    {
      propKey: "password",
      elementKey: "password",
    },
  ];
  
  const resumeFields = [
    {
      propKey: "education",
      elementKey: "education",
    },
    {
      propKey: "skills",
      elementKey: "skills",
    },
    {
      propKey: "workStatus",
      elementKey: "workStatus",
    },
    {
      propKey: "yearsOfExperience",
      elementKey: "yearsOfExperience",
    },
    {
      propKey: "description",
      elementKey: "resumeDescription",
    },
    {
      propKey: "resumeActive",
      elementKey: "resumeActive",
    },
  ];
  
  const projectFields = [
    {
      propKey: "projectTitle",
      elementKey: "projectTitle",
    },
    {
      propKey: "description",
      elementKey: "projectDescription",
    },
    {
      propKey: "startDate",
      elementKey: "projectStartDate",
    },
    {
      propKey: "endDate",
      elementKey: "projectEndDate",
    },
  ];

  module.exports = {
    projectFields,
    resumeFields,
    companyFields
  }