
export const idl = {
    "version": "0.1.0",
    "name": "questbook",
    "instructions": [
        {
            "name": "initialize",
            "accounts": [
                {
                    "name": "programInfo",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "authority",
                    "type": "publicKey"
                }
            ]
        },
        {
            "name": "createWorkspace",
            "accounts": [
                {
                    "name": "workspace",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "workspaceOwner",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "workspaceAdmin",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "metadataHash",
                    "type": "string"
                },
                {
                    "name": "adminEmail",
                    "type": "string"
                }
            ]
        },
        {
            "name": "updateWorkspace",
            "accounts": [
                {
                    "name": "workspace",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "workspaceAdmin",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": false,
                    "isSigner": true
                }
            ],
            "args": [
                {
                    "name": "metadataHash",
                    "type": "string"
                },
                {
                    "name": "adminId",
                    "type": "u32"
                }
            ]
        },
        {
            "name": "addWorkspaceAdmin",
            "accounts": [
                {
                    "name": "workspace",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "workspaceAdmin",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "newWorkspaceAdmin",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "workspaceAdminId",
                    "type": "u32"
                },
                {
                    "name": "adminEmail",
                    "type": "string"
                },
                {
                    "name": "adminAuthority",
                    "type": "publicKey"
                }
            ]
        },
        {
            "name": "removeWorkspaceAdmin",
            "accounts": [
                {
                    "name": "workspace",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "workspaceAdmin",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "removeWorkspaceAdmin",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "adminId",
                    "type": "u32"
                },
                {
                    "name": "removeAdminId",
                    "type": "u32"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "ProgramInfo",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "version",
                        "type": "u16"
                    },
                    {
                        "name": "authority",
                        "type": "publicKey"
                    },
                    {
                        "name": "bump",
                        "type": "u8"
                    }
                ]
            }
        },
        {
            "name": "Workspace",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "authority",
                        "type": "publicKey"
                    },
                    {
                        "name": "metadataHash",
                        "type": "string"
                    },
                    {
                        "name": "adminCount",
                        "type": "u32"
                    },
                    {
                        "name": "adminIndex",
                        "type": "u32"
                    },
                    {
                        "name": "createdAt",
                        "type": "i64"
                    },
                    {
                        "name": "bump",
                        "type": "u8"
                    }
                ]
            }
        },
        {
            "name": "WorkspaceAdmin",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "workspace",
                        "type": "publicKey"
                    },
                    {
                        "name": "authority",
                        "type": "publicKey"
                    },
                    {
                        "name": "adminId",
                        "type": "u32"
                    },
                    {
                        "name": "isAdmin",
                        "type": "bool"
                    },
                    {
                        "name": "email",
                        "type": "string"
                    },
                    {
                        "name": "bump",
                        "type": "u8"
                    }
                ]
            }
        }
    ],
    "types": [
        {
            "name": "ErrorCode",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "NotSupported"
                    },
                    {
                        "name": "AdminNotInWorkspace"
                    },
                    {
                        "name": "NotAuthorized"
                    }
                ]
            }
        }
    ]
}
