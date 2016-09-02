swagger-ref-resolver
====================

Swagger and the swagger ecosystem are not especially well suited to
document composition. In our case, we want to group a set of related
operations into a single service/API, but they have a small but natural
set of groupings. The aggregate swagger document can be unwieldy as a single
file. The swagger-ref-resolver module allows you to create a composite
swagger doc made of multiple *valid* swagger subdocuments. For example:

```
{
    "swagger": "2.0",
    "paths": {
        "$ref": [
            "./someCoolStuff.json#paths",
            "./someBoringStuff.json#paths"
        ]
    },
    "definitions": {
        "$ref": [
            "./common.json#definitions",
            "./someCoolStuff.json#definitions",
            "./someBoringStuff.json#definitions"
        ]
    }
}
```

In the above example, someCoolStuff and someBoringStuff can be fully valid
swagger documents that can be edited in [Swagger Editor](http://editor.swagger.io).

swagger-ref-resolver can then take the root swagger doc and turn it into a
normal single-file swagger doc. It can do this at "runtime" or via a CLI 
(for example to be used in a prepublish script).