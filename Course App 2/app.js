class Course {
    constructor(title,instructor,image){
        this.courseId = Math.floor(Math.random()*1000000);
        this.title = title;
        this.instructor = instructor;
        this.image = image;
    }
}

class UI {
    addCourseToList(course){
     var list = document.getElementById('course-list');
     var html = `
     <tr>
     <td><image src="img/${course.image}"/></img></td>
     <td>${course.title}</td>
     <td>${course.instructor}</td>
     <td><a href="#" data-id="${course.courseId}" class="btn btn-danger delete">Delete</a>
     </tr>
     `

     list.innerHTML += html;
    }

    clearInputs(){
        const title = document.getElementById('title').value="";
        const instructor = document.getElementById('instructor').value="";
        const image = document.getElementById('image').value="";
    }

    deleteCourse(element){
        if(element.classList.contains('delete')){
            element.parentElement.parentElement.remove();
            return true;
        }
    }

    showAlert(message,className){
        var alert = `<div class="alert alert-${className}">${message}</div>`;

        const row = document.querySelector('.row');

        row.insertAdjacentHTML('beforebegin',alert)

        setTimeout(() => {
          document.querySelector('.alert').remove()
        },3000)
    }
}


class Storage {
    static getCourses(){
        let courses;

        if(localStorage.getItem('courses')===null){
            courses = [];
        }else{
            courses = JSON.parse(localStorage.getItem('courses'))
        }
        return courses;
    }

    static displayCourses(){
        const courses = Storage.getCourses();
        courses.forEach(course => {
            const ui = new UI();
            ui.addCourseToList(course);
        });
    }

    static addCourses(course){
     const courses = Storage.getCourses();
     courses.push(course);
     localStorage.setItem('courses',JSON.stringify(courses))
    }

    static deleteCourses(element){
        if(element.classList.contains('delete')){
            const courses = Storage.getCourses();
            const id = element.getAttribute('data-id')
            courses.forEach((course,index) => {
                if(course.courseId == id){
                    courses.splice(index,1)
                }
            })
            localStorage.setItem('courses',JSON.stringify(courses));
        }
    }
}

document.addEventListener('DOMContentLoaded',Storage.displayCourses())

document.getElementById('new-course').addEventListener('submit', (e) =>{
    const title = document.getElementById('title').value;
    const instructor = document.getElementById('instructor').value;
    const image = document.getElementById('image').value;

    const course = new Course(title,instructor,image)

    // create UI

    const ui = new UI();

    // add course to list

    if(title === "" || instructor === "" || image === ""){
        ui.showAlert('Please complete the form','warning');
    }else{
        ui.addCourseToList(course);

        // clear ınputs
    
        ui.clearInputs();

         Storage.addCourses(course);
    
        ui.showAlert('The course has been added','success');
    }

    e.preventDefault()
})

document.getElementById('course-list').addEventListener('click', (e) => {
    const ui = new UI();
    if(ui.deleteCourse(e.target)){
        Storage.deleteCourses(e.target)
        ui.showAlert('The course has been deleted','danger')
    }
})