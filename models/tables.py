# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.

import datetime

def get_user_email():
    return auth.user.email if auth.user else None


db.define_table('user_show_list',
                Field('user_id', 'references auth_user', default=auth.user_id),
                Field('mal_id', 'integer'),
                Field('title', 'text'),
                Field('english_title', 'text'),
                Field('episode_number', 'integer'),
                Field('episodes_watched', 'integer', default=0),
                Field('favorite', 'boolean', default=False),
                Field('image_url'),
                Field('user_score', 'integer', default=0),
                Field('community_score', 'double'),
                Field('list_status'),  # possible: watching, planToWatch, onHold, completed, dropped
                )


# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)
