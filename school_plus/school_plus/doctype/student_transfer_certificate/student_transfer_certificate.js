// Copyright (c) 2018, efeone and contributors
// For license information, please see license.txt

frappe.ui.form.on('Student Transfer Certificate', {
	print_template: function(frm) {
		get_print_preview(frm);
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
				console.log(r);
				if(!r.exc) {
					frm.set_value("print_preview", r.message);
					frm.refresh_field("print_preview");
					console.log("ASSSSSSSSSSSSSSSS");
					// frm.meta.default_print_format = "Patient Consent Form"
					// frm.print_doc()
				}
			}
		});
	}
}
