
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#blah').attr('src', e.target.result);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    


    function addMoreWorkInformation() {
       let wrapper = $('#work-information-wrapper');
        let html = `<div class="col-md-12 py-2 d-flex justify-content-between align-items-center clone">
                    <div class="col-md-5">
                     <span class="remove-Work">remove</span>
                        <div class="d-flex flex-column" id="workInformation">
                            <div class="form-group">
                                <label for="companyName">Company Name</label>
                                <input type="text" class="form-control" id="companyName" name="workDes[companyName]"
                                    placeholder="" >
                            </div>
                            <div class="form-group">
                                <label for="jobTitle">Job Title</label>
                                <input type="text" class="form-control" id="jobTitle" name="workDes[jobTitle]" placeholder="" >
                            </div>
                        </div>
                    </div>
                    <div class="col-md-5 d-flex flex-column mx-3">
                        <div class="d-flex flex-row">
                            <div class="d-flex flex-column">
                                <label for="workStartDate">Start Date</label>
                                <div>
                                    <input type='date' id="workStartDate" name="workDes[workStartDate]"
                                        class="btn btn-outline-primary my-3" onchange="readURL(this);" />
                                </div>
                            </div>
                            <div class="fd-flex pl-2 flex-column">
                                <label for="workEndDate">End Date</label>
                                <div>
                                    <input type='date' id="workEndDate" name="workDes[workEndDate]" class="btn btn-outline-primary my-3"
                                        onchange="readURL(this);" />
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="description">Job Description</label>
                            <textarea class="form-control" columns="5" id="description" name="workDes[WorkDescription]"
                                placeholder=""></textarea>
                        </div>
                    </div>
                </div>`;
        wrapper.append(html);
    }
    $(document).on("click", ".clone .remove-Work", function (e) {
        $(e.target).parent().parent().remove();
    });

    
    function addMoreProject() {
        let wrapper = $('#project-wrapper');
        let html = `<div class="col-md-12 py-2 d-flex justify-content-between align-items-center clone">
                    <div class="col-md-5">
                       <span class="remove-Work">remove</span>
                        <div class="d-flex" id="project">
                            <div class="d-flex flex-column">
                                <div class="form-group">
                                    <label for="ConfirmPassword">Project Title</label>
                                    <input type="text" class="form-control" id="projectTitle" name="project[projectTitle]"
                                        placeholder="" >
                                </div>
                                <div class="form-group">
                        <label for="projectDesc">Project Description</label>
                        <input type="text" class="form-control" id="projectDesc" name="project[projectDesc]" placeholder="" >
                    </div>
                                <div class="d-flex">
                                    <div class="fd-flex flex-column">
                                        <label for="ConfirmPassword">Start Date</label>
                                        <div>
                                            <input type='date' id="projectStartDate" name="project[startDate]"
                                                class="btn btn-outline-primary my-3" onchange="readURL(this);"  />
                                        </div>
                                    </div>
                                    <div class="fd-flex pl-2 flex-column">
                                        <label for="ConfirmPassword">End Date</label>
                                        <div>
                                            <input type='date' id="projectEndDate" name="project[endDate]"
                                                class="btn btn-outline-primary my-3" onchange="readURL(this);"  />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>`;
        wrapper.append(html);
    }
 

     function addMoreEducation() {
        let wrapper = $('#education-wrapper');
        let html = `<div class="col-md-12 py-2 d-flex justify-content-between align-items-center clone">
                    <div class="col-md-5">
                       <span class="remove-Work">remove</span>
                        <div class="d-flex" id="project">
                            <div class="d-flex flex-column">
                                <div class="form-group">
                                        <label for="schoolName">School Name</label>
                                        <input type="text" class="form-control" id="schoolName" name="School[schoolName]" value="{{this.schoolName}}" >
                                    </div>
                                    <div class="form-group">
                                        <label for="gpa">G.P.A</label>
                                        <input type="number" class="form-control" id="gpa" name="School[gpa]" value="{{this.gpa}}" >
                                    </div>
                            </div>
                        </div>
                    </div>
                                                <div class="col-md-6">
                                <div class="form-group">
                                        <div class="fd-flex flex-column ml-3">
                                            <label for="startDate">Start Date</label>
                                            <input type='date' id="startDate" name="School[startDate]" class="form-control btn btn-outline-primary" value="{{this.startDate}}"
                                                onchange="readURL(this);"  />
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="fd-flex flex-column ml-3">
                                            <label for="endDate">End Date</label>
                                            <input type='date' id="endDate" name="School[endDate]" class="form-control btn btn-outline-primary" value="{{this.endDate}}"
                                                onchange="readURL(this);"  />
                                        </div>
                                    </div>
                            </div>
                </div>`;
        wrapper.append(html);
    }