function searchToggle(){
    var general = $('#searchBar');
    var filter = $('#filteredSearch');

    var button = $('#filteredSearchReveal')
    if(filter.css("display") == 'none'){
        filter.css("display", "block");
        general.css("display", "none");
        button.prop("value", "Use General Search");
    }else{
        filter.css("display", "none");
        general.css("display", "block");
        button.prop("value", "Use Filtered Search");
    }
}

function getSkills(){
    return [
        "Mongodb",
        "Nodejs",
        "Express",
        "React",
        "Software Architecture",
        "Front-End Development",
        "Back-End Development",
        "Full-Stack Development",
        "C",
        "C++",
        "C#",
        "Java",
        "Javascript",
        "Python",
        "Database Management",
        "SQL",
        "MySQL",
        "SQLite",
        "CAD",
        "Machine Shop",
        "Cybersecurity Analysis",
        "Data Analytics",
        "Project Management",
        "Scrum",
        "Agile Development",
        "HTML",
        "HTML5"
    ]
}
