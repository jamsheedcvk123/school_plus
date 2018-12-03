from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"label": _("Exit"),
			"items": [
				{
					"type": "doctype",
					"name": "Student Transfer Certificate"
				}
			]
		},
		{
			"label": _("Setup"),
			"items": [
				{
					"type": "doctype",
					"name": "Student Print Template"
				}
			]
		}
	]
