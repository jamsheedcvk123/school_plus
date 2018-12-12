// Copyright (c) 2018, efeone and contributors
// For license information, please see license.txt

frappe.ui.form.on('Student Transfer Certificate', {
	print_template: function(frm) {
		get_print_preview(frm);
	},
	student: function(frm) {
		frappe.call({
			method: "school_plus.school_plus.utils.get_student_details",
			args: {
				student: frm.doc.student
			},
			callback: function (data) {
				if(data.message){
					if(data.message.student){
						var student = data.message.student;
						if(student.guardians){
							student.guardians.forEach(function(guardian) {
								if(guardian.relation == "Father"){
									frm.set_value("father_guardian", guardian.guardian_name);
									frm.set_value("guardian_relation", "Father");
								}
								else if(guardian.relation == "Mother"){
									frm.set_value("mother", guardian.guardian_name);
								}
							});
						}
						frm.set_value("first_name", student.first_name);
						frm.set_value("middle_name", student.middle_name);
						frm.set_value("last_name", student.last_name);
						frm.set_value("joining_date", student.joining_date);
						frm.set_value("date_of_birth", student.date_of_birth);
						frm.set_value("blood_group", student.blood_group);
						frm.set_value("gender", student.gender);
						frm.set_value("nationality", student.nationality);
					}
					if(data.message.first_enrollment && data.message.first_enrollment.length > 0){
						frm.set_value("student_category", data.message.first_enrollment[0].student_category);
						frm.set_value("joining_program", data.message.first_enrollment[0].program);
						frm.set_value("joining_date", data.message.first_enrollment[0].enrollment_date);
					}
					if(data.message.last_enrollment && data.message.last_enrollment.length > 0){
						frm.set_value("leaving_program", data.message.last_enrollment[0].program);
					}
				}
			}
		});
	},
	date_of_birth:function(frm) {
		if(frm.doc.date_of_birth){
			frm.set_value("date_of_birth_in_words", frappe.datetime.global_date_format(frm.doc.date_of_birth));
		}
	},
	last_annual_exam_result:function(frm) {
		frm.set_value("qualified_for", "");
		if(frm.doc.last_annual_exam_result == "Failed"){
			frm.set_value("failed_in_program", frm.doc.leaving_program);
			frm.set_value("failed_by", 1);
		}
		else{
			frm.set_value("failed_in_program", "");
			frm.set_value("failed_by", 0);
		}
	},
	leaving_program:function(frm) {
		if(frm.doc.leaving_program){
			frappe.call({
				method: "frappe.client.get",
				args: {
					doctype: "Program",
					name: frm.doc.leaving_program
				},
				callback: function (data) {
					if(data.message){
						frm.set_value("leaving_program_name", data.message.program_name);
					}
				}
			});
			frm.events.get_courses(frm);
		}
	},
	get_courses: function(frm) {
		frm.set_value("courses_in_leaving_program",[]);
		frappe.call({
			method: "get_courses",
			doc:frm.doc,
			callback: function(r) {
				if(r.message) {
					frm.set_value("courses_in_leaving_program", r.message);
				}
			}
		})
	}
});

var get_print_preview= function(frm) {
	if(frm.doc.print_template) {
		return frappe.call({
			method: 'school_plus.school_plus.doctype.student_print_template.student_print_template.render_student_doc_template',
			args: {
				template_name: frm.doc.print_template,
				doc: frm.doc
			},
			callback: function(r) {
				if(!r.exc) {
					frm.set_value("print_preview", r.message);
					frm.refresh_field("print_preview");
					// frm.meta.default_print_format = "Patient Consent Form"
					// frm.print_doc()
				}
			}
		});
	}
}
