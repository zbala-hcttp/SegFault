# SegFault
SegFault

https://medium.com/@s_van_laar/deploy-a-private-ipfs-network-on-ubuntu-in-5-steps-5aad95f7261b

IPFS Config File Start
{
  "API": {
    "HTTPHeaders": {
      "Access-Control-Allow-Methods": [
        "PUT",
        "GET",
        "POST"
      ],
      "Access-Control-Allow-Origin": [
        "*"
      ]
    }
  },
  "Addresses": {
    "API": "/ip4/127.0.0.1/tcp/5001",
    "Announce": [],
    "Gateway": "/ip4/127.0.0.1/tcp/8080",
    "NoAnnounce": [],
    "Swarm": [
      "/ip4/0.0.0.0/tcp/4001",
      "/ip6/::/tcp/4001"
    ]
  },
  "Bootstrap": [
    "/ip4/127.0.0.1/tcp/4001/ipfs/QmW7w4QDTncACwdetXqxp1zmceKE9SWRLeWJyheWuZoDfF"
  ],
  "Datastore": {
    "BloomFilterSize": 0,
    "GCPeriod": "1h",
    "HashOnRead": false,
    "Spec": {
      "mounts": [
        {
          "child": {
            "path": "blocks",
            "shardFunc": "/repo/flatfs/shard/v1/next-to-last/2",
            "sync": true,
            "type": "flatfs"
          },
          "mountpoint": "/blocks",
          "prefix": "flatfs.datastore",
          "type": "measure"
        },
        {
          "child": {
            "compression": "none",
            "path": "datastore",
            "type": "levelds"
          },
          "mountpoint": "/",
          "prefix": "leveldb.datastore",
          "type": "measure"
        }
      ],
      "type": "mount"
    },
    "StorageGCWatermark": 90,
    "StorageMax": "10GB"
  },
  "Discovery": {
    "MDNS": {
      "Enabled": true,
      "Interval": 10
    }
  },
  "Experimental": {
    "FilestoreEnabled": false,
    "Libp2pStreamMounting": false,
    "P2pHttpProxy": false,
    "QUIC": false,
    "ShardingEnabled": false,
    "UrlstoreEnabled": false
  },
  "Gateway": {
    "APICommands": [],
    "HTTPHeaders": {
      "Access-Control-Allow-Headers": [
        "X-Requested-With",
        "Range"
      ],
      "Access-Control-Allow-Methods": [
        "GET"
      ],
      "Access-Control-Allow-Origin": [
        "*"
      ]
    },
    "PathPrefixes": [],
    "RootRedirect": "",
    "Writable": false
  },
  "Identity": {
    "PeerID": "QmW7w4QDTncACwdetXqxp1zmceKE9SWRLeWJyheWuZoDfF",
    "PrivKey": "CAASqAkwggSkAgEAAoIBAQDPj75nga/wYERwBpy7AOsslhF/FyHdAiTxVBzDgqlVqEhGrLH0+KFRVzrmlYIs2LoyauppukTR4649g+Yf9zwxm6UuMO8K9wINHLc4tJ8tDqD/Ki9ud+T49cyVGBH6/vdN+uKoTTbrTcwoalGWarjHQeP9L8u5AfOBerq802ehyamA0MSHicLPMZiboScACUdt5wYRPXxEBp3D9Q6Omap0EbMrAsirOYtKcOdTCfBAFoKsOTw4VnKCWl5aqcuD1qK51ZcN/0CwkEdh6cWZwj2iUKo2IL+Rddx92XJhLIMC2n6GW/krOEwjSPa1eTQfRhekdXFZyUCn7d5ODZG+dQeVAgMBAAECggEAOsZbhnfk2E6KUqasrw+diKyeG7zzK+A1kdjdpEdVqBnVDZ5Nbi8RjzUCStU/XW+pmilIY9QJNN4iMu0stxSNiQaoCaJ1rkcv34KoJ3iOMnYYBOlvMPrmbdE8s2Nzg/27DevjTwE+cfc/vpoMrGlgFZyE8Ocd6y+wQpP8WQgMKnWrSgSyCIYGevqnAJm1AV5QAqAqVX+gIAVJ1GpcSO4Fl6oV1DUsBGLmGSHkv3Y3R0LxjsBUkyH/52yPwT/4ZQGAY5WJSz8NW8lbpejll0OeLIfU++VqjuGJH1R22ACmfkrYB1imw4T1JQ0nSYBw2bA4rUpbxQ1eqhBUzgg/+VRn6QKBgQDQ8m8EFHskAuJGvA5IIDpspZ1+5Fsul1p4cZDHqpTZNIxZ5nOLS+b6ylyFZVcYtjpWOy/GcGFQC1k6unnE6KBlwOjRNB2FpSftErrjGkWEMeqwaEC2hxPAFiTINrbM5rP6sMz2Lb4Zw5ena1DvBxM1alQrCqLMK2icZVvNld0rgwKBgQD+TW/nf7hAmELSehA2tA+dcE2K9a25P+V6aTSQyMi4j2VhPK7MdLgWAQEEPpq4AuQGdJj18LLoAucbNrC79s8zcGonUBi8MRWl8Px1aH0eTZSp07DhD0r2rcKmaEQ8tF59Lr69TCpfQuKpf0w9yBe0DK0jHQ9k9iXCYwKhSqkdBwKBgQC4VXi9N7hfT7ACSTusQ8pnOUCVxq3uj5Y/9aiNjZ7ddG9xjE5ZEHBIxigTgxDweytCEdsXDOO88xYYKpTss3F181cx4PE+izKLAuAfJHk5o7PxRzf4D3jMGH0AqMxiPhF/02QutrIkFpr/Fz0CctJuaEyy4CI5Tv5uIzl3SIQjMwKBgG+L8hkemeijoTQH3NLR+sN5floE1/YZRASE30ze9cSXCcY0Qwxl6lWkjRiaiW1Lv0/hlzLSKPfCRjNWswFQCqUqmzWxWZg7A57tbR/m/HLtXtd7huvBtIUtxOMPe1cRWx0YAwyvuypcAWaN8xhqi5MruEpdteH4Yqm4mm+7eyDDAoGBANDIp9nMFV69kXMTnTx1jVw1Yk8k1e7BAl7h/Vy7tmf1GZka7/FET2INticqVNgv/qdURJlcp6xVLNzoIZp0oTb515XohMOY7x8XV06I3GtVhoxy7XUTEOCfT/v4f7ys4SMQwoPT5zfAuR2rcCJLZt1CE4UqfxNJ+u0hp9iNpyxp"
  },
  "Ipns": {
    "RecordLifetime": "",
    "RepublishPeriod": "",
    "ResolveCacheSize": 128
  },
  "Mounts": {
    "FuseAllowOther": false,
    "IPFS": "/ipfs",
    "IPNS": "/ipns"
  },
  "Pubsub": {
    "DisableSigning": false,
    "Router": "",
    "StrictSignatureVerification": false
  },
  "Reprovider": {
    "Interval": "12h",
    "Strategy": "all"
  },
  "Routing": {
    "Type": "dht"
  },
  "Swarm": {
    "AddrFilters": null,
    "ConnMgr": {
      "GracePeriod": "20s",
      "HighWater": 900,
      "LowWater": 600,
      "Type": "basic"
    },
    "DisableBandwidthMetrics": false,
    "DisableNatPortMap": false,
    "DisableRelay": false,
    "EnableRelayHop": false
  }
}

IPFS Config File End

If tab crashed error -> Clear browser data
