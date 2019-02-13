// Copyright (c) 2019, efeone and contributors
// For license information, please see license.txt

frappe.ui.form.on('Add Admission Number Tool', {
	refresh: function(frm) {
		frm.disable_save();
		cur_frm.fields_dict["student_admission_number_list"].grid.wrapper.find('.grid-add-row').hide();
		cur_frm.fields_dict["student_admission_number_list"].grid.add_custom_button(__('Update'), () => {
			frappe.call({
				doc: frm.doc,
				method: "update_student",
				callback: function(r) {
					frm.reload_doc();
				},
				freeze: true,
				freeze_message: __("Updating .....")
			})
		});
	},
	program: function(frm) {
		get_student_list_from_entrolment(frm)
	},
	academic_year: function(frm) {
		get_student_list_from_entrolment(frm)
	}
});

var get_student_list_from_entrolment = function(frm) {
	if(frm.doc.program && frm.doc.academic_year){
		frappe.call({
			method: "school_plus.school_plus.doctype.add_admission_number_tool.add_admission_number_tool.get_student_list",
			args: {
				program: frm.doc.program,
				academic_year: frm.doc.academic_year
			},
			callback: function(r) {
				frm.set_value("student_admission_number_list", []);
				if(r.message && r.message.length > 0){
					r.message.forEach(function(data){
						var item = frappe.model.add_child(frm.doc, 'Student Admission Number List', 'student_admission_number_list');
						frappe.model.set_value(item.doctype, item.name, 'student', data.student);
						frappe.model.set_value(item.doctype, item.name, 'student_name', data.student_name);
					})
					frm.refresh_fields();
				}
			},
			freeze: true,
			freeze_message: __("Fetching details .....")
		});
		frm.refresh_fields();
	}
}
