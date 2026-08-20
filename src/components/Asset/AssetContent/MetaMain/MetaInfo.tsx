import AssetType from '@shared/AssetType'
import Time from '@shared/atoms/Time'
import Publisher from '@shared/Publisher'
import { getAssetAccessType, isSaasAsset } from '@utils/ddo'
import { ReactElement } from 'react'
import styles from './MetaInfo.module.css'
import { AssetExtended } from 'src/@types/AssetExtended'

export default function MetaInfo({
  asset,
  nftPublisher
}: {
  asset: AssetExtended
  nftPublisher: string
}): ReactElement {
  const isSaas = isSaasAsset(asset)
  const accessType = getAssetAccessType(asset)
  const nftOwner = asset?.indexedMetadata?.nft?.owner

  return (
    <div className={styles.wrapper}>
      <AssetType
        type={isSaas ? 'saas' : asset?.credentialSubject?.metadata.type}
        accessType={accessType}
        className={styles.assetType}
      />
      <div className={styles.byline}>
        <div>
          Published{' '}
          <Time date={asset?.credentialSubject?.metadata.created} relative />
          {nftPublisher && nftPublisher !== nftOwner && (
            <span>
              {' by '} <Publisher account={nftPublisher} />
            </span>
          )}
          {asset?.credentialSubject?.metadata.created !==
            asset?.credentialSubject?.metadata.updated && (
            <>
              {' — '}
              <span className={styles.updated}>
                updated{' '}
                <Time
                  date={asset?.credentialSubject?.metadata.updated}
                  relative
                />
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
